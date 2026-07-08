import express from 'express';
import jwt from 'jsonwebtoken';
import { login, registro } from '../../controllers/auth..js';
import { forgoPassword, verificarCodigo, forgotPassword } from '../../controllers/Recuperar.js';

const router = express.Router();

// rutas de autenticacion
router.post('/registro', registro);
router.post('/login', login);

// ruta de olvido de contraseña
router.post('/forgot-password', forgotPassword);
router.post('/verify', verificarCodigo);

export default router;