// middleware/verificarToken.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { obtenerUsuarioPorCorreo, eliminarToken } from '../models/userModel';

export const verificarToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Suponiendo que el token se envía en el encabezado 'Authorization'

    if (!token) {
        return res.status(401).json({ mensaje: 'Token no proporcionado' });
    }

    try {
        // Verificar el token
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secreto');

        // Obtener el usuario por correo
        const usuario = await obtenerUsuarioPorCorreo(decoded.correo);

        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        // Verificar si la fecha de expiración del token es mayor a la fecha actual
        const fechaActual = new Date();

        if (usuario.fecha_expiracion && usuario.fecha_expiracion < fechaActual) {
            // Si el token ha expirado, eliminarlo
            await eliminarToken(usuario.correo);
            return res.status(401).json({ mensaje: 'Token ha expirado' });
        }

        // Si todo está bien, se puede continuar con la siguiente función
        req.body = usuario; // Opcional: puedes agregar el usuario al request para acceder más tarde
        next();
    } catch (error) {
        console.error('Error al verificar el token:', error);
        return res.status(401).json({ mensaje: 'Token inválido' });
    }
};
