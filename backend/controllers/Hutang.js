import Hutang from '../models/HutangModel.js';
import Users from '../models/UserModel.js';

export const getHutang = async (req, res) => {
  try {
    let response = await Hutang.findAll({
      attributes: ['uuid', 'jumlah', 'tanggal', 'alasan', 'penghutang'],
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

export const getHutangById = async (req, res) => {
  try {
    const hutang = await Hutang.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!hutang) return res.status(404).json({ msg: 'Data hutang tidak ditemukan' });
    let response;
    if (req.role === 'admin') {
      response = await Hutang.findOne({
        attributes: ['uuid', 'jumlah', 'tanggal', 'alasan', 'penghutang'],
        where: {
          id: hutang.id,
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

export const createHutang = async (req, res) => {
  try {
    const { jumlah, tanggal, alasan, penghutang } = req.body;
    if (req.role === 'admin') {
      await Hutang.create({
        jumlah,
        tanggal,
        alasan,
        penghutang,
        userId: req.userId,
      });
    } else {
      return res.status(200).json({ msg: 'Anda bukan admin' });
    }
    res.status(201).json({ msg: 'Berhasil menambahkan hutang' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateHutang = async (req, res) => {
  try {
    const hutang = await Hutang.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    const { jumlah, tanggal, alasan, penghutang } = req.body;
    if (!hutang) return res.status(404).json({ msg: 'Data hutang tidak ditemukan' });
    let response;
    if (req.role === 'admin') {
      response = await Hutang.update(
        {
          jumlah,
          tanggal,
          alasan,
          penghutang,
        },
        {
          where: {
            id: hutang.id,
          },
        }
      );
    } else {
      return res.status(200).json({ msg: 'Anda bukan admin' });
    }
    res.status(200).json({ msg: 'Hutang berhasil diperbarui' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteHutang = async (req, res) => {
  try {
    const hutang = await Hutang.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!hutang) return res.status(404).json({ msg: 'Data hutang tidak ditemukan' });

    if (req.role === 'admin') {
      await Hutang.destroy({
        where: {
          id: hutang.id,
        },
      });
    } else {
      return res.status(200).json({ msg: 'Anda bukan admin' });
    }
    res.status(200).json({ msg: 'Hutang berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
