
import { Request, Response } from 'express';
import { obtenerTodosLosMetodosPago as MetodosPago, contarBilleterasPorUsuario, insertarBilleteraDigital, insertarTarjetaCredito, insertarTransferenciaBanco, obtenerBilleteraDigitalPorUsuario, obtenerTarjetaCreditoPorUsuario, obtenerTransferenciaBancoPorUsuario } from '../models/Transactions/paymentMethod';
// Controlador para obtener MetodosPago
export const obtenerTodosLosMetodosPago = async (req: Request, res: Response): Promise<Response> => {
    try {
        const usuarios = await MetodosPago();
        return res.status(200).json(usuarios);
    } catch (error) {
        console.error('Error al obtener métodos de pago:', error);
        return res.status(500).json({ message: 'Error al obtener métodos de pago' });
    }
};


// Controlador para insertar una nueva transferencia bancaria
export const crearTransferenciaBanco = async (req: Request, res: Response): Promise<Response> => {
    const {  nombre_banco, numero_cuenta, clabe_o_iban, user_id } = req.body;

    if (  !nombre_banco || !numero_cuenta || !clabe_o_iban || !user_id) {
        return res.status(400).json({ message: 'Todos los campos son requeridos.' });
    }

    try {
        await insertarTransferenciaBanco({ nombre_banco, numero_cuenta, clabe_o_iban, user_id });
        return res.status(201).json({ message: 'Transferencia bancaria creada exitosamente.' });
    } catch (error) {
        console.error('Error al crear transferencia bancaria:', error);
        return res.status(500).json({ message: 'Error al crear transferencia bancaria.' });
    }
};

// Controlador para obtener Transferencia Bancaria por usuario
export const obtenerTransferenciaBanco = async (req: Request, res: Response): Promise<Response> => {
    const { user_id } = req.params;

    try {
        const transferencias = await obtenerTransferenciaBancoPorUsuario(Number(user_id));
        if (transferencias) {
            return res.status(200).json(transferencias);
        } else {
            return res.status(404).json({ message: 'No se encontraron transferencias bancarias para este usuario.' });
        }
    } catch (error) {
        console.error('Error al obtener transferencia bancaria:', error);
        return res.status(500).json({ message: 'Error al obtener transferencia bancaria.' });
    }
};

// Controlador para insertar una nueva tarjeta de crédito/débito
export const crearTarjetaCredito = async (req: Request, res: Response): Promise<Response> => {
    const { numero_tarjeta, fecha_vencimiento, cvv, nombre_titular, user_id } = req.body;

    if ( !numero_tarjeta || !fecha_vencimiento || !cvv || !nombre_titular || !user_id) {
        return res.status(400).json({ message: 'Todos los campos son requeridos.' });
    }

    try {
        await insertarTarjetaCredito({ numero_tarjeta, fecha_vencimiento, cvv, nombre_titular, user_id });
        return res.status(201).json({ message: 'Tarjeta de crédito/débito creada exitosamente.' });
    } catch (error) {
        console.error('Error al crear tarjeta de crédito/débito:', error);
        return res.status(500).json({ message: 'Error al crear tarjeta de crédito/débito.' });
    }
};

// Controlador para obtener Tarjeta de Crédito/Débito por usuario
export const obtenerTarjetaCredito = async (req: Request, res: Response): Promise<Response> => {
    const { user_id } = req.params;

    try {
        const tarjetas = await obtenerTarjetaCreditoPorUsuario(Number(user_id));
        if (tarjetas) {
            return res.status(200).json(tarjetas);
        } else {
            return res.status(404).json({ message: 'No se encontraron tarjetas de crédito para este usuario.' });
        }
    } catch (error) {
        console.error('Error al obtener tarjeta de crédito/débito:', error);
        return res.status(500).json({ message: 'Error al obtener tarjeta de crédito/débito.' });
    }
};

// Controlador para insertar una nueva billetera digital
export const crearBilleteraDigital = async (req: Request, res: Response): Promise<Response> => {
    const { direccion_billetera, user_id } = req.body;

    if (!direccion_billetera || !user_id) {
        return res.status(400).json({ message: 'Todos los campos son requeridos.' });
    }

    try {
        // Verificar cuántas billeteras tiene el usuario
        const totalBilleteras = await contarBilleterasPorUsuario(user_id);
        
        // Si el usuario ya tiene 5 billeteras, devolver un error
        if (totalBilleteras >= 5) {
            return res.status(400).json({ message: 'El usuario ya tiene la cantidad máxima de 5 billeteras digitales.' });
        }

        // Insertar la nueva billetera digital
        await insertarBilleteraDigital({ direccion_billetera, user_id });
        return res.status(201).json({ message: 'Billetera digital creada exitosamente.' });
    } catch (error) {
        console.error('Error al crear billetera digital:', error);
        return res.status(500).json({ message: 'Error al crear billetera digital.' });
    }
};


// Controlador para obtener Billetera Digital por usuario
export const obtenerBilleteraDigital = async (req: Request, res: Response): Promise<Response> => {
    const { user_id } = req.params;

    try {
        const billeteras = await obtenerBilleteraDigitalPorUsuario(Number(user_id));
        if (billeteras) {
            return res.status(200).json(billeteras);
        } else {
            return res.status(404).json({ message: 'No se encontraron billeteras digitales para este usuario.' });
        }
    } catch (error) {
        console.error('Error al obtener billetera digital:', error);
        return res.status(500).json({ message: 'Error al obtener billetera digital.' });
    }
};