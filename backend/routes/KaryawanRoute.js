import express from 'express';
import { createKaryawan, deleteKaryawan, getKaryawan, getKaryawanById, updateKaryawan } from '../controllers/Karyawan.js';
import { VerifyUser } from '../middleware/AuthMiddleware.js';

const router = express.Router();

router.get('/karyawan', VerifyUser, getKaryawan);
router.get('/karyawan/:id', VerifyUser, getKaryawanById);
router.post('/karyawan', VerifyUser, createKaryawan);
router.patch('/karyawan/:id', VerifyUser, updateKaryawan);
router.delete('/karyawan/:id', VerifyUser, deleteKaryawan);

export default router;
