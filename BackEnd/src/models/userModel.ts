// src/models/userModel.ts
import pool from '../config';
import bcrypt from 'bcryptjs';

export interface Usuario {
    id?: number;
    nombre: string;
    correo: string;
    contraseña: string;
    metodo_autenticacion?: string;
    es_verificado?: boolean;
    token_refresco?: string;
    fecha_creacion?: Date; // Puedes agregar esta propiedad si la quieres manejar
    fecha_actualizacion?: Date; // Igualmente, si la necesitas
}

// Función para crear un nuevo usuario en la base de datos
export const crearUsuario = async (usuario: Usuario): Promise<Usuario> => {
    const { nombre, correo, contraseña, metodo_autenticacion = 'email', es_verificado = false } = usuario;

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const result = await pool.query(
        `INSERT INTO usuarios (nombre, correo, contraseña, metodo_autenticacion, es_verificado)
        VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [nombre, correo, hashedPassword, metodo_autenticacion, es_verificado]
    );

    return result.rows[0];
};

// Función para buscar un usuario por su correo
export const obtenerUsuarioPorCorreo = async (correo: string): Promise<Usuario | null> => {
    const result = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
    if (result.rows.length > 0) {
        return result.rows[0];
    }
    return null;
};

// Función para obtener todos los usuarios
export const obtenerTodosLosUsuarios = async (): Promise<Usuario[]> => {
    const result = await pool.query('SELECT * FROM usuarios');
    return result.rows; // Devuelve la lista de usuarios
};
