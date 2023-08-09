import express from 'express';
import { createPendapatan, deletePendapatan, getPendapatan, getPendapatanById, getPendapatanSemingguTerakhir, updatePendapatan } from '../controllers/Pendapatan.js';
import { VerifyUser } from '../middleware/AuthMiddleware.js';

const router = express.Router();

router.get('/pendapatan', VerifyUser, getPendapatan);
router.get('/pendapatan/:id', VerifyUser, getPendapatanById);
router.post('/pendapatan', VerifyUser, createPendapatan);
router.patch('/pendapatan/:id', VerifyUser, updatePendapatan);
router.delete('/pendapatan/:id', VerifyUser, deletePendapatan);
router.get('/pendapatanterakhir', VerifyUser, getPendapatanSemingguTerakhir);

export default router;
