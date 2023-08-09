import Pengeluaran from '../models/PengeluaranModel.js';
import Users from '../models/UserModel.js';
import { Op } from 'sequelize';

export const getPengeluaran = async (req, res) => {
  try {
    let response = await Pengeluaran.findAll({
      attributes: ['uuid', 'tanggal', 'jumlah', 'sumber'],
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

export const getPengeluaranById = async (req, res) => {
  try {
    const pengeluaran = await Pengeluaran.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!pengeluaran) return res.status(404).json({ msg: 'Data pengeluaran tidak ditemukan' });
    let response;
    if (req.role === 'admin') {
      response = await Pengeluaran.findOne({
        attributes: ['uuid', 'tanggal', 'jumlah', 'sumber'],
        where: {
          id: pengeluaran.id,
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
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createPengeluaran = async (req, res) => {
  try {
    const { tanggal, jumlah, sumber } = req.body;
    if (req.role === 'admin') {
      await Pengeluaran.create({
        tanggal,
        jumlah,
        sumber,
        userId: req.userId,
      });
    } else {
      return res.status(200).json({ msg: 'Anda bukan admin' });
    }
    res.status(201).json({ msg: 'Berhasil menambahkan pengeluaran' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updatePengeluaran = async (req, res) => {
  try {
    const pengeluaran = await Pengeluaran.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    const { tanggal, jumlah, sumber } = req.body;
    if (!pengeluaran) return res.status(404).json({ msg: 'Data pengeluaran tidak ditemukan' });
    let response;
    if (req.role === 'admin') {
      response = await Pengeluaran.update(
        {
          tanggal,
          jumlah,
          sumber,
        },
        {
          where: {
            id: pengeluaran.id,
          },
        }
      );
    } else {
      return res.status(200).json({ msg: 'Anda bukan admin' });
    }
    res.status(200).json({ msg: 'Pengeluaran berhasil diperbarui' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deletePengeluaran = async (req, res) => {
  try {
    const pengeluaran = await Pengeluaran.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!pengeluaran) return res.status(404).json({ msg: 'Data pengeluaran tidak ditemukan' });

    if (req.role === 'admin') {
      await Pengeluaran.destroy({
        where: {
          id: pengeluaran.id,
        },
      });
    } else {
      return res.status(200).json({ msg: 'Anda bukan admin' });
    }
    res.status(200).json({ msg: 'Pengeluaran berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getPengeluaranSemingguTerakhir = async (req, res) => {
  try {
    const tanggalHariIni = new Date();
    const tanggal7HariLalu = new Date();
    tanggal7HariLalu.setDate(tanggal7HariLalu.getDate() - 7);

    const response = await Pengeluaran.findAll({
      attributes: ['uuid', 'tanggal', 'jumlah', 'sumber'],
      include: [
        {
          model: Users,
          attributes: ['nama', 'email', 'url'],
        },
      ],
      where: {
        tanggal: {
          [Op.between]: [tanggal7HariLalu, tanggalHariIni],
        },
      },
      order: [['id', 'DESC']],
    });

    let hasil = [];
    let groupedByDate = {};
    response.forEach((res) => {
      const tanggal = new Date(res.tanggal);
      const tanggalSaja = tanggal.getDate();
      const bulan = tanggal.toLocaleString('id-ID', { month: 'long' });
      let hariBulan = tanggalSaja + ' ' + bulan;

      if (!groupedByDate[hariBulan]) {
        groupedByDate[hariBulan] = { tanggal: hariBulan, jumlah: parseInt(res.jumlah) };
      } else {
        groupedByDate[hariBulan].jumlah += parseInt(res.jumlah);
      }
    });

    // Membuat array hasil dari objek groupedByDate
    for (const key in groupedByDate) {
      hasil.push(groupedByDate[key]);
    }

    res.status(200).json(hasil);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
