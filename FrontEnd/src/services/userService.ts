import axios from 'axios';

interface LoginResponse {
    mensaje: string;
    usuario?: {
        id: number;
        nombre: string;
        correo: string;
        es_verificado: boolean;
        token: string;
        saldo: number; // Agregado
    };
}

// src/services/userService.ts

export const registerUser = async (nombre: string, correo: string, contraseña: string) => {
    const response = await fetch('http://localhost:3000/usuarios/registro', {
        method: 'POST',
        headers: {
            'ConteInversión Recomendada: $50.00nt-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, correo, contraseña }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el registro');
    }

    return await response.json();
};


export const loginUser = async (correo: string, contraseña: string): Promise<LoginResponse> => {
    try {
        const response = await axios.post('http://localhost:3000/usuarios/login', {
            correo,
            contraseña,
        });
        return response.data;
    } catch (error: unknown) {
        // Manejo del error
        if (axios.isAxiosError(error)) {
            // Si el token ha expirado, devolver solo el mensaje
            throw new Error(error.response?.data?.mensaje || 'Error al iniciar sesión: ' + error.message);
        } else {
            throw new Error('Error al iniciar sesión: Ocurrió un error inesperado.');
        }
    }
};

export const loginUserWithEmail = async (correo: string): Promise<LoginResponse> => {
    try {
        const response = await axios.post('http://localhost:3000/usuarios/login-response', { correo });
        
        // Retornar los datos de la respuesta si el login fue exitoso
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            // Si el token ha expirado o hubo otro error en el login
            throw new Error(error.response?.data?.mensaje || 'Error al iniciar sesión: ' + error.message);
        } else {
            throw new Error('Error al iniciar sesión: Ocurrió un error inesperado.');
        }
    }
};
