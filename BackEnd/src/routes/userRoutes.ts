import { Router } from 'express';
import {  registrarUsuario, obtenerUsuarios } from '../controllers/userController';

const router = Router();

// Ruta para obtener todos los usuarios
router.get('/', obtenerUsuarios);
// Ruta para registrar un nuevo usuario (POST)
router.post('/registro', registrarUsuario);

export default router;
