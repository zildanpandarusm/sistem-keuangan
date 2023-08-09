import Users from '../models/UserModel.js';

// Kode untuk verifikasi user apakah user telah login ke aplikasi apa belum sebagai middleware
export const VerifyUser = async (req, res, next) => {
  if (!req.session.userId) return res.status(404).json({ msg: 'Anda belum login' });

  const user = await Users.findOne({
    where: {
      uuid: req.session.userId,
    },
  });

  if (!user) return res.status(404).json({ msg: 'Data user tidak ditemukan' });
  req.userId = user.id;
  req.role = user.role;
  next();
};

// Kode agar pengguna tidak bisa akses halaman yang hanya admin yang bisa melihat
export const AdminRole = async (req, res, next) => {
  const admin = await Users.findOne({
    where: {
      uuid: req.session.userId,
    },
  });

  if (!admin) return res.status(400).json({ msg: 'Data user tidak ditemukan' });
  if (admin.role !== 'admin') return res.status(403).json({ msg: 'Akses terlarang' });
  next();
};
