
import { Request, Response } from 'express';
import { obtenerTodosLosMetodosPago as MetodosPago, insertarBilleteraDigital, insertarTarjetaCredito, insertarTransferenciaBanco } from '../models/Transactions/paymentMethod';
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
    const { transaccion_id, nombre_banco, numero_cuenta, clabe_o_iban } = req.body;

    if (!transaccion_id || !nombre_banco || !numero_cuenta || !clabe_o_iban) {
        return res.status(400).json({ message: 'Todos los campos son requeridos.' });
    }

    try {
        await insertarTransferenciaBanco({ nombre_banco, numero_cuenta, clabe_o_iban });
        return res.status(201).json({ message: 'Transferencia bancaria creada exitosamente.' });
    } catch (error) {
        console.error('Error al crear transferencia bancaria:', error);
        return res.status(500).json({ message: 'Error al crear transferencia bancaria.' });
    }
};

// Controlador para insertar una nueva tarjeta de crédito/débito
export const crearTarjetaCredito = async (req: Request, res: Response): Promise<Response> => {
    const { transaccion_id, numero_tarjeta, fecha_vencimiento, cvv, nombre_titular } = req.body;

    if (!transaccion_id || !numero_tarjeta || !fecha_vencimiento || !cvv || !nombre_titular) {
        return res.status(400).json({ message: 'Todos los campos son requeridos.' });
    }

    try {
        await insertarTarjetaCredito({ numero_tarjeta, fecha_vencimiento, cvv, nombre_titular });
        return res.status(201).json({ message: 'Tarjeta de crédito/débito creada exitosamente.' });
    } catch (error) {
        console.error('Error al crear tarjeta de crédito/débito:', error);
        return res.status(500).json({ message: 'Error al crear tarjeta de crédito/débito.' });
    }
};

// Controlador para insertar una nueva billetera digital
export const crearBilleteraDigital = async (req: Request, res: Response): Promise<Response> => {
    const { transaccion_id, direccion_billetera } = req.body;

    if (!transaccion_id || !direccion_billetera) {
        return res.status(400).json({ message: 'Todos los campos son requeridos.' });
    }

    try {
        await insertarBilleteraDigital({ direccion_billetera });
        return res.status(201).json({ message: 'Billetera digital creada exitosamente.' });
    } catch (error) {
        console.error('Error al crear billetera digital:', error);
        return res.status(500).json({ message: 'Error al crear billetera digital.' });
    }
};