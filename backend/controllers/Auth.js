import Users from '../models/UserModel.js';
import argon2 from 'argon2';

export const Login = async (req, res) => {
  const user = await Users.findOne({
    where: {
      email: req.body.email,
    },
  });

  if (!user) return res.status(404).json({ msg: 'Akun Anda tidak terdaftar' });
  const match = await argon2.verify(user.password, req.body.password);

  if (!match) return res.status(400).json({ msg: 'Password Anda salah' });

  req.session.userId = user.uuid;
  const uuid = user.uuid;
  const nama = user.nama;
  const email = user.email;
  const foto = user.foto;
  const role = user.role;
  const url = user.url;
  res.status(200).json({ uuid, nama, email, foto, role, url });
};

export const StatusLogin = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ msg: 'Mohon login ke akun Anda!' });
  }
  const user = await Users.findOne({
    attributes: ['uuid', 'nama', 'email', 'foto', 'role', 'url'],
    where: {
      uuid: req.session.userId,
    },
  });
  if (!user) return res.status(404).json({ msg: 'User tidak ditemukan' });
  res.status(200).json(user);
};

export const logOut = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(400).json({ msg: 'Tidak dapat logout' });
    res.status(200).json({ msg: 'Anda telah logout' });
  });
};
