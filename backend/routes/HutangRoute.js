import express from 'express';
import { createHutang, deleteHutang, getHutang, getHutangById, updateHutang } from '../controllers/Hutang.js';
import { VerifyUser } from '../middleware/AuthMiddleware.js';

const router = express.Router();

router.get('/hutang', VerifyUser, getHutang);
router.get('/hutang/:id', VerifyUser, getHutangById);
router.post('/hutang', VerifyUser, createHutang);
router.patch('/hutang/:id', VerifyUser, updateHutang);
router.delete('/hutang/:id', VerifyUser, deleteHutang);

export default router;
