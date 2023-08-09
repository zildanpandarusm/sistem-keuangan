import Karyawan from '../models/KaryawanModel.js';
import Users from '../models/UserModel.js';

export const getKaryawan = async (req, res) => {
  try {
    let response = await Karyawan.findAll({
      attributes: ['uuid', 'nama', 'posisi', 'alamat', 'kontak'],
      include: [
        {
          model: Users,
          attributes: ['nama', 'email', 'url'],
        },
      ],
      order: [['id', 'DESC']],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getKaryawanById = async (req, res) => {
  try {
    const karyawan = await Karyawan.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!karyawan) return res.status(404).json({ msg: 'Data karyawan tidak ditemukan' });
    let response;
    if (req.role === 'admin') {
      response = await Karyawan.findOne({
        attributes: ['uuid', 'nama', 'posisi', 'alamat', 'kontak'],
        where: {
          id: karyawan.id,
        },
        include: [
          {
            model: Users,
            attributes: ['uuid', 'nama', 'email', 'url'],
          },
        ],
      });
    } else {
      return res.status(200).json({ msg: 'Anda bukan admin' });
      //   response = await Karyawan.findOne({
      //     attributes: ['nama', 'posisi', 'alamat', 'kontak'],
      //     where: {
      //       [Op.and]: [{ id: karyawan.id }, { userId: req.userId }],
      //     },
      //     include: [
      //       {
      //         model: Users,
      //         attributes: ['nama', 'email', 'url'],
      //       },
      //     ],
      //   });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createKaryawan = async (req, res) => {
  try {
    const { nama, posisi, alamat, kontak } = req.body;
    if (req.role === 'admin') {
      await Karyawan.create({
        nama: nama,
        posisi: posisi,
        alamat: alamat,
        kontak: kontak,
        userId: req.userId,
      });
    } else {
      return res.status(200).json({ msg: 'Anda bukan admin' });
    }
    res.status(201).json({ msg: 'Berhasil menambahkan karyawan' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateKaryawan = async (req, res) => {
  try {
    const karyawan = await Karyawan.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    const { nama, posisi, alamat, kontak } = req.body;
    if (!karyawan) return res.status(404).json({ msg: 'Data karyawan tidak ditemukan' });
    let response;
    if (req.role === 'admin') {
      response = await Karyawan.update(
        {
          nama: nama,
          posisi: posisi,
          alamat: alamat,
          kontak: kontak,
        },
        {
          where: {
            id: karyawan.id,
          },
        }
      );
    } else {
      return res.status(200).json({ msg: 'Anda bukan admin' });
      //   if (req.userId !== karyawan.userId) return res.status(403).json({ msg: 'Akses terlarang' });
      //   response = await Karyawan.update(
      //     {
      //       nama: nama,
      //       posisi: posisi,
      //       alamat: alamat,
      //       kontak: kontak,
      //     },
      //     {
      //       where: {
      //         [Op.and]: [{ id: karyawan.id }, { userId: req.userId }],
      //       },
      //     }
      //   );
    }
    res.status(200).json({ msg: 'Karyawan berhasil diperbarui' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteKaryawan = async (req, res) => {
  try {
    const karyawan = await Karyawan.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!karyawan) return res.status(404).json({ msg: 'Data karyawan tidak ditemukan' });

    if (req.role === 'admin') {
      await Karyawan.destroy({
        where: {
          id: karyawan.id,
        },
      });
    } else {
      return res.status(200).json({ msg: 'Anda bukan admin' });
      //   if (req.userId !== karyawan.userId) return res.status(403).json({ msg: 'Akses terlarang' });
      //   await Karyawan.destroy({
      //     where: {
      //       [Op.and]: [{ id: karyawan.id }, { userId: req.userId }],
      //     },
      //   });
    }
    res.status(200).json({ msg: 'Karyawan berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
