import express from 'express';
import { createUser, deleteUser, getUserById, getUsers, updateUser } from '../controllers/Users.js';
import { VerifyUser, AdminRole } from '../middleware/AuthMiddleware.js';

const router = express.Router();

router.get('/users', VerifyUser, AdminRole, getUsers);
router.get('/users/:id', VerifyUser, AdminRole, getUserById);
router.post('/users', VerifyUser, AdminRole, createUser);
router.patch('/users/:id', VerifyUser, AdminRole, updateUser);
router.delete('/users/:id', VerifyUser, AdminRole, deleteUser);

export default router;
