import express from 'express';
import { Login, StatusLogin, logOut } from '../controllers/Auth.js';

const router = express.Router();

router.get('/statuslogin', StatusLogin);
router.post('/login', Login);
router.delete('/logout', logOut);

export default router;
