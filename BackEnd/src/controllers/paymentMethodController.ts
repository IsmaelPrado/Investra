
import { Request, Response } from 'express';
import { obtenerTodosLosMetodosPago as MetodosPago } from '../models/Transactions/paymentMethod';
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
