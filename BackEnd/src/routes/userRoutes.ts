import { Router } from 'express';
import {  registrarUsuario, obtenerUsuarios, loginUsuario, verificarCodigoVerificacion, verificarTokenPorCorreo } from '../controllers/userController';
import { verificarToken } from '../middleware/verificarToken';

const router = Router();

// Ruta para obtener todos los usuarios
router.get('/', obtenerUsuarios);
// Ruta para registrar un nuevo usuario (POST)
router.post('/registro', registrarUsuario);
//Ruta para login de usuario con código de verificación
router.post('/login', loginUsuario);
// Ruta para verificar el código de verificación y validarlo
router.post('/verificar', verificarCodigoVerificacion);
// Ruta para verificar el token por correo
router.post('/verificar-token', verificarTokenPorCorreo);


// Rutas protegidas
router.get('/protected-route', verificarToken, (req, res) => {
    res.json({ mensaje: 'Acceso permitido a la ruta protegida', usuario: req.body });
});


export default router;
