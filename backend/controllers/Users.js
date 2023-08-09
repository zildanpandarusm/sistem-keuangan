import Users from '../models/UserModel.js';
import path from 'path';
import argon2 from 'argon2';
import fs from 'fs';

export const getUsers = async (req, res) => {
  try {
    const response = await Users.findAll({
      attributes: ['id', 'uuid', 'nama', 'email', 'role', 'url'],
      order: [['id', 'DESC']],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const response = await Users.findOne({
      attributes: ['id', 'uuid', 'nama', 'email', 'role', 'url'],
      where: {
        uuid: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createUser = async (req, res) => {
  if (req.files === null) return res.status(400).json({ msg: 'Tidak Ada File Yang Diupload' });
  const { nama, email, password, confPassword, role } = req.body;

  if (password !== confPassword) return res.status(400).json({ msg: 'Password dan Confirm Password Tidak Sama' });
  const hashPassword = await argon2.hash(password);

  const file = req.files.foto;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const url = `${req.protocol}://${req.get('host')}/images/${fileName}`;
  const allowedType = ['.png', '.jpeg', '.jpg'];
  if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: 'File Gambar Tidak Valid' });
  if (fileSize > 5000000) return res.status(422).json({ msg: 'Ukuran gambar harus kurang dari 5mb' });

  file.mv(`./public/images/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ msg: err.message });
    try {
      await Users.create({
        nama: nama,
        email: email,
        password: hashPassword,
        foto: fileName,
        role: role,
        url: url,
      });
      res.status(201).json({ msg: 'User berhasil dibuat' });
    } catch (error) {
      console.log(error.message);
    }
  });
};

export const updateUser = async (req, res) => {
  const user = await Users.findOne({
    where: {
      uuid: req.params.id,
    },
  });

  if (!user) return res.status(404).json({ msg: 'Data tidak ditemukan' });

  let fileName = '';
  if (req.files === null) {
    fileName = user.foto;
  } else {
    const file = req.files.foto;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    fileName = file.md5 + ext;

    const allowedType = ['.png', '.jpeg', '.jpg'];
    if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: 'Gambar tidak valid' });
    if (fileSize > 5000000) return res.status(422).json({ msg: 'Ukuran gambar harus kurang dari 5mb' });

    // Menghapus image di folder public/images
    const filepath = `./public/images/${user.foto}`;
    fs.unlinkSync(filepath);

    file.mv(`./public/images/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });
  }
  const url = `${req.protocol}://${req.get('host')}/images/${fileName}`;

  const { nama, email, password, confPassword, role } = req.body;
  let hashPassword;
  if (password === '' || password === null) {
    hashPassword = user.password;
  } else {
    hashPassword = await argon2.hash(password);
  }
  if (password !== confPassword) return res.status(400).json({ msg: 'Password dan Confirm Password tidak cocok' });
  try {
    await Users.update(
      {
        nama: nama,
        email: email,
        password: hashPassword,
        foto: fileName,
        role: role,
        url: url,
      },
      {
        where: {
          uuid: req.params.id,
        },
      }
    );
    res.status(200).json({ msg: 'User berhasil diperbarui' });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteUser = async (req, res) => {
  const user = await Users.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ msg: 'User tidak ditemukan' });
  try {
    await Users.destroy({
      where: {
        id: user.id,
      },
    });
    res.status(200).json({ msg: 'User dihapus' });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
