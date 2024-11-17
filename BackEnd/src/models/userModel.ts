// src/models/userModel.ts
import pool from '../config';
import bcrypt from 'bcryptjs';

export interface Usuario {
    id?: number;
    nombre: string;
    correo: string;
    contraseña: string;
    codigo_verificacion?: number;
    metodo_autenticacion?: string;
    es_verificado?: boolean;
    token_refresco?: string;
    fecha_expiracion?: Date;
    fecha_creacion?: Date; // Puedes agregar esta propiedad si la quieres manejar
    fecha_actualizacion?: Date; // Igualmente, si la necesitas
    saldo?: number;
    estado_encuesta: boolean;
}

// Función para crear un nuevo usuario en la base de datos
//Registro de usuarios
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

// Función para obtener un usuario por su ID
export const obtenerUsuarioPorId = async (usuarioId: number): Promise<Usuario | null> => {
    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [usuarioId]);

        if (result.rows.length > 0) {
            return result.rows[0];
        } else {
            return null; // Usuario no encontrado
        }
    } catch (error) {
        console.error('Error al obtener usuario por ID:', error);
        throw error;
    }
};

// Función para obtener todos los usuarios
export const obtenerTodosLosUsuarios = async (): Promise<Usuario[]> => {
    const result = await pool.query('SELECT * FROM usuarios');
    return result.rows; // Devuelve la lista de usuarios
};

//Función para generar un código de verificación
export const generarCodigoVerificacion = (): string => {
    // Generar un código de verificación de 6 dígitos
    return Math.floor(100000 + Math.random() * 900000).toString();
};


export const validarCredenciales = async (correo: string, contraseña: string): Promise<Usuario | null> => {
    const result = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);

    if (result.rows.length > 0) {
        const usuario = result.rows[0];
        
        // Comparar la contraseña ingresada con la encriptada en la base de datos
        const isMatch = await bcrypt.compare(contraseña, usuario.contraseña);
        if (isMatch) {
                      
            return usuario;
        }
    }
    return null;
};

// Función para actualizar el código de verificación en la base de datos
export const actualizarCodigoVerificacion = async (correo: string, codigoVerificacion: string): Promise<void> => {
    await pool.query(
        `UPDATE usuarios 
         SET codigo_verificacion = $1, fecha_actualizacion = NOW() 
         WHERE correo = $2`,
        [codigoVerificacion, correo]
    );
};

// Función para obtener el código de verificación de un usuario por su correo
export const obtenerCodigoVerificacionPorCorreo = async (correo: string): Promise<string | null> => {
    const result = await pool.query(
        'SELECT codigo_verificacion FROM usuarios WHERE correo = $1',
        [correo]
    );

    if (result.rows.length > 0) {
        return result.rows[0].codigo_verificacion;
    }

    return null;
};

// Método para actualizar el estado de verificación del usuario y eliminar el código de verificación
export const verificarUsuario = async (correo: string): Promise<void> => {
    try {
        await pool.query(
            'UPDATE usuarios SET es_verificado = $1, codigo_verificacion = NULL WHERE correo = $2',
            [true, correo]
        );
    } catch (error) {
        console.error('Error al actualizar la verificación del usuario:', error);
        throw error;
    }
};


// Método para actualizar el token y la fecha de expiración en la base de datos
export const actualizarTokenYFechaExpiracion = async (correo: string, token: string, fechaExpiracion: Date): Promise<void> => {
    await pool.query(
        `UPDATE usuarios 
         SET token_refresco = $1, fecha_actualizacion = NOW(), fecha_expiracion = $2 
         WHERE correo = $3`,
        [token, fechaExpiracion, correo]
    );
};

// Método para eliminar el token del usuario
export const eliminarToken = async (correo: string): Promise<void> => {
    await pool.query(
        'UPDATE usuarios SET token_refresco = NULL, fecha_expiracion = NULL WHERE correo = $1',
        [correo]
    );
};

// Función para obtener el token de un usuario por su correo
export const obtenerTokenPorCorreo = async (correo: string): Promise<{ token: string | null; fechaExpiracion: Date | null }> => {
    const result = await pool.query(
        'SELECT token_refresco, fecha_expiracion FROM usuarios WHERE correo = $1',
        [correo]
    );

    if (result.rows.length > 0) {
        return {
            token: result.rows[0].token_refresco,
            fechaExpiracion: result.rows[0].fecha_expiracion ? new Date(result.rows[0].fecha_expiracion) : null

        };
    }

    return {
        token: null,
        fechaExpiracion: null
    };
};

// Función para actualizar el saldo de un usuario
export const actualizarSaldoUsuario = async (usuarioId: number, nuevoSaldo: number): Promise<void> => {
    try {
        await pool.query(
            'UPDATE usuarios SET saldo = $1, fecha_actualizacion = NOW() WHERE id = $2',
            [nuevoSaldo, usuarioId]
        );
    } catch (error) {
        console.error('Error al actualizar saldo del usuario:', error);
        throw error;
    }
};


// Función para actualizar el estado de la encuesta del usuario
export const actualizarEstadoEncuesta = async (usuarioId: number): Promise<Usuario | null> => {
    try {
        const result = await pool.query(
            `UPDATE usuarios 
            SET estado_encuesta = true, fecha_actualizacion = NOW() 
            WHERE id = $1 
            RETURNING *`,
            [usuarioId]
        );

        if (result.rows.length > 0) {
            return result.rows[0]; // Devuelve el usuario actualizado
        } else {
            return null; // Usuario no encontrado
        }
    } catch (error) {
        console.error('Error al actualizar el estado de la encuesta:', error);
        throw error;
    }
};
