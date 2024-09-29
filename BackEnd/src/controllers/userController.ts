import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { crearUsuario, Usuario, obtenerUsuarioPorCorreo, obtenerTodosLosUsuarios } from '../models/userModel';

// Registrar un nuevo usuario
export const registrarUsuario = async (req: Request, res: Response): Promise<Response> => {
    const { nombre, correo, contraseña } = req.body;

    try {
        // Verificar si el correo ya está registrado
        const usuarioExistente = await obtenerUsuarioPorCorreo(correo);
        if (usuarioExistente) {
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        // Crear el usuario
        const nuevoUsuario = await crearUsuario({ 
            nombre, 
            correo, 
            contraseña,
            metodo_autenticacion: 'email', // Puedes dejar esto aquí o modificar según sea necesario
            es_verificado: false // Inicialmente no verificado
        });

        // Generar un token JWT para el nuevo usuario
        const token = jwt.sign({ id: nuevoUsuario.id, correo: nuevoUsuario.correo }, process.env.JWT_SECRET || 'secreto', {
            expiresIn: '1h', // El token expira en 1 hora
        });

        return res.status(201).json({
            message: 'Usuario registrado exitosamente',
            usuario: {
                id: nuevoUsuario.id,
                nombre: nuevoUsuario.nombre,
                correo: nuevoUsuario.correo,
            },
            token,
        });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};


// Obtener todos los usuarios
export const obtenerUsuarios = async (req: Request, res: Response): Promise<Response> => {
    try {
        const usuarios = await obtenerTodosLosUsuarios();
        return res.status(200).json(usuarios);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        return res.status(500).json({ message: 'Error al obtener usuarios' });
    }
};
