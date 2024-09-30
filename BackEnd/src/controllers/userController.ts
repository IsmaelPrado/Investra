import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { crearUsuario, Usuario, obtenerUsuarioPorCorreo, obtenerTodosLosUsuarios, validarCredenciales, actualizarCodigoVerificacion, generarCodigoVerificacion, verificarUsuario, actualizarTokenYFechaExpiracion, obtenerTokenPorCorreo, eliminarToken } from '../models/userModel';
import { Resend } from 'resend';
import { error } from 'console';

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

        return res.status(201).json({
            message: 'Usuario registrado exitosamente',
            usuario: {
                id: nuevoUsuario.id,
                nombre: nuevoUsuario.nombre,
                correo: nuevoUsuario.correo,
            },
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


// Instancia de Resend con tu clave API
const resend = new Resend('re_CihCtxXs_2VJoFSjCifonQ5NBmNJNq5XE'); 

export const loginUsuario = async (req: Request, res: Response) => {
    const { correo, contraseña } = req.body;

    try {
        const usuario = await validarCredenciales(correo, contraseña);

        if (!usuario) {
            return res.status(401).json({ mensaje: 'Usuario no encontrado' });
        }

        // Verificar el token antes de validar las credenciales
        const { token, fechaExpiracion } = await obtenerTokenPorCorreo(correo);
        
        if (token) {
            try {
                const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secreto');
                const usuarioPorToken = await obtenerUsuarioPorCorreo(decoded.correo);

                // Si el usuario existe y el token es válido
                if (usuarioPorToken) {
                    return res.status(200).json({
                        mensaje: 'Login exitoso',
                        usuario: {
                            id: usuarioPorToken.id,
                            nombre: usuarioPorToken.nombre,
                            correo: usuarioPorToken.correo,
                            es_verificado: usuarioPorToken.es_verificado,
                            token: usuarioPorToken.token_refresco
                        }
                    });
                }
            } catch (err) {
                // Manejar el error si el token ha expirado
                if (err instanceof jwt.TokenExpiredError) {
                    const nuevoCodigoVerificacion: string = generarCodigoVerificacion();

                    // Actualizar el código de verificación en la base de datos
                    await actualizarCodigoVerificacion(usuario.correo, nuevoCodigoVerificacion);

                    // Enviar el nuevo código de verificación al correo del usuario usando Resend
                    const { data, error } = await resend.emails.send({
                        from: 'Investra <investra@resend.dev>',
                        to: [correo],
                        subject: 'Nuevo código de verificación en Investra',
                        html: `
                        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
                            <header style="background-color: #4CAF50; padding: 10px; text-align: center;">
                                <h1 style="color: white;">Investra</h1>
                            </header>
                            <main style="padding: 20px; background-color: #f9f9f9;">
                                <h2 style="color: #4CAF50;">Hola, ${usuario.nombre}</h2>
                                <p>Tu token ha expirado. Para verificar tu cuenta, utiliza el siguiente nuevo código de verificación:</p>
                                
                                <div style="text-align: center; margin: 20px 0;">
                                    <span style="font-size: 24px; font-weight: bold; background-color: #e7f4e4; padding: 10px 20px; border-radius: 5px;">
                                        ${nuevoCodigoVerificacion}
                                    </span>
                                </div>

                                <p>Este código es válido solo por los próximos 10 minutos. Si no solicitaste este código, por favor ignora este correo.</p>

                                <a href="https://investra.com/verificar" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color:  #154360 ; color: white; text-decoration: none; border-radius: 5px;">
                                    Verificar mi cuenta
                                </a>
                            </main>
                            <footer style="text-align: center; padding: 10px; background-color: #4CAF50; color: white;">
                                <p>¿Necesitas ayuda? <a href="mailto:soporte@investra.com" style="color: white;">Contáctanos</a></p>
                                <p>Síguenos en nuestras redes sociales:</p>
                                <a href="https://twitter.com/investra" style="margin: 0 5px; color: white;">Twitter</a> | 
                                <a href="https://facebook.com/investra" style="margin: 0 5px; color: white;">Facebook</a>
                            </footer>
                        </div>
                        `,
                    });

                    if (error) {
                        console.error('Error al enviar el correo:', error);
                        return res.status(500).json({ mensaje: 'Error al enviar el correo de verificación' });
                    }

                    return res.status(200).json({ mensaje: 'El token ha expirado. Se ha enviado un nuevo código de verificación a tu correo.' });
                }
                return res.status(500).json({ mensaje: 'Error al verificar el token.' });
            }
        } else {
            // Si el token no existe, enviar el código de verificación
            const nuevoCodigoVerificacion: string = generarCodigoVerificacion();

            // Actualizar el código de verificación en la base de datos
            await actualizarCodigoVerificacion(correo, nuevoCodigoVerificacion);

            // Enviar el nuevo código de verificación al correo del usuario usando Resend
            const { data, error } = await resend.emails.send({
                from: 'Investra <investra@resend.dev>',
                to: [correo],
                subject: 'Código de verificación en Investra',
                html: `
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
                    <header style="background-color: #4CAF50; padding: 10px; text-align: center;">
                        <h1 style="color: white;">Investra</h1>
                    </header>
                    <main style="padding: 20px; background-color: #f9f9f9;">
                        <h2 style="color: #4CAF50;">Hola, ${usuario.nombre}</h2>
                        <p>No se encontró un token asociado a tu cuenta. Para verificar tu cuenta, utiliza el siguiente código de verificación:</p>
                        
                        <div style="text-align: center; margin: 20px 0;">
                            <span style="font-size: 24px; font-weight: bold; background-color: #e7f4e4; padding: 10px 20px; border-radius: 5px;">
                                ${nuevoCodigoVerificacion}
                            </span>
                        </div>

                        <p>Este código es válido solo por los próximos 10 minutos. Si no solicitaste este código, por favor ignora este correo.</p>

                        <a href="https://investra.com/verificar" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color:  #154360 ; color: white; text-decoration: none; border-radius: 5px;">
                            Verificar mi cuenta
                        </a>
                    </main>
                    <footer style="text-align: center; padding: 10px; background-color: #4CAF50; color: white;">
                        <p>¿Necesitas ayuda? <a href="mailto:soporte@investra.com" style="color: white;">Contáctanos</a></p>
                        <p>Síguenos en nuestras redes sociales:</p>
                        <a href="https://twitter.com/investra" style="margin: 0 5px; color: white;">Twitter</a> | 
                        <a href="https://facebook.com/investra" style="margin: 0 5px; color: white;">Facebook</a>
                    </footer>
                </div>
                `,
            });

            if (error) {
                console.error('Error al enviar el correo:', error);
                return res.status(500).json({ mensaje: 'Error al enviar el correo de verificación', detalle: error });
            }

            return res.status(200).json({ mensaje: 'No se encontró un token asociado a tu cuenta. Se ha enviado un nuevo código de verificación a tu correo.' });
        }

    } catch (error) {
        console.error('Error en el login:', error);
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};




// Método para verificar el código de verificación enviado al correo del usuario y para generar JWT si es válido el codigo de verificación
export const verificarCodigoVerificacion = async (req: Request, res: Response): Promise<Response> => {
    const { correo, codigo_verificacion } = req.body;

    try {
        // Obtener el usuario por correo
        const usuario = await obtenerUsuarioPorCorreo(correo);

        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        // Verificar si el código de verificación coincide
        if (usuario.codigo_verificacion === codigo_verificacion) {
            // Si el código es correcto, actualizar el estado de verificación del usuario usando el nuevo método
            await verificarUsuario(correo);

            // Generar un token JWT para el usuario autenticado
            const token = jwt.sign(
                { id: usuario.id, correo: usuario.correo },
                process.env.JWT_SECRET || 'secreto',
                { expiresIn: '1h' } // El token expira en 1 hora
            );

            // Calcular la fecha de expiración del token
            const fechaExpiracion = new Date();
            fechaExpiracion.setHours(fechaExpiracion.getHours() + 1); // Expira en 1 hora

            // Almacenar el token y la fecha de expiración en la base de datos
            await actualizarTokenYFechaExpiracion(usuario.correo, token, fechaExpiracion);

            return res.status(200).json({
                mensaje: 'Verificación exitosa. Usuario autenticado',
                token,
                fechaExpiracion, // Enviar la fecha de expiración en la respuesta
                usuario: {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    correo: usuario.correo,
                    es_verificado: true,
                }
            });
        } else {
            return res.status(400).json({ mensaje: 'Código de verificación incorrecto' });
        }
    } catch (error) {
        console.error('Error en la verificación del código:', error);
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};


// Método para verificar si el token existe a través del correo
export const verificarTokenPorCorreo = async (req: Request, res: Response) => {
    const { correo } = req.body; // Suponiendo que el correo se envía en el cuerpo de la solicitud

    try {
        // Obtener el token y la fecha de expiración por correo
        const { token, fechaExpiracion } = await obtenerTokenPorCorreo(correo);


        // Si no hay token, enviar un mensaje de que no hay token para este usuario
        if (!token) {
            return res.status(404).json({ mensaje: 'No hay token para este usuario.' });
        }

        // Obtener la fecha actual del sistema
        const fechaActual = new Date();
       
           // Verificamos que la fechaExpiracion no sea null antes de compararla
           if (!fechaExpiracion || fechaActual > fechaExpiracion) {
            // Si la fecha actual es mayor o no hay fecha de expiración, eliminar el token
            await eliminarToken(correo);
            return res.status(401).json({ mensaje: 'El token ha expirado.' });
        }

        // Si el token es válido, devolverlo
        return res.status(200).json({ 
            mensaje: 'Token encontrado.',
            token: {
                token,
                fechaExpiracion
            }
        });
    } catch (error) {
        console.error('Error al verificar el token:', error);
        return res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
};