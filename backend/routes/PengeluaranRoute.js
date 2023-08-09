import express from 'express';
import { getPengeluaran, getPengeluaranById, createPengeluaran, updatePengeluaran, deletePengeluaran, getPengeluaranSemingguTerakhir } from '../controllers/Pengeluaran.js';
import { VerifyUser } from '../middleware/AuthMiddleware.js';

const router = express.Router();

router.get('/pengeluaran', VerifyUser, getPengeluaran);
router.get('/pengeluaran/:id', VerifyUser, getPengeluaranById);
router.post('/pengeluaran', VerifyUser, createPengeluaran);
router.patch('/pengeluaran/:id', VerifyUser, updatePengeluaran);
router.delete('/pengeluaran/:id', VerifyUser, deletePengeluaran);
router.get('/pengeluaranterakhir', VerifyUser, getPengeluaranSemingguTerakhir);

export default router;
