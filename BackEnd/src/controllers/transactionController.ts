// src/controllers/transactionController.ts
import { Request, Response } from 'express';
import {
    crearTransaccion,
    obtenerTransaccionesPorUsuario,
    obtenerTodasLasTransacciones as obtenerallTransacciones,
    obtenerTransaccionPorId as obtenerTransaccionPorIdModelo, // Renombrar aquí
    eliminarTransaccion as deleteTransaction,
    Transaccion,
} from '../models/Transactions/transactionModel';

// Controlador para crear una nueva transacción
export const crearNuevaTransaccion = async (req: Request, res: Response) => {
    const { usuarioId, cantidad, metodoPagoId, proposito }: Transaccion = req.body;

    try {
        const nuevaTransaccion = await crearTransaccion({ usuarioId, cantidad, metodoPagoId, proposito });
        res.status(201).json(nuevaTransaccion);
    } catch (error) {
        console.error('Error al crear la transacción:', error);
        res.status(500).json({ error: 'Error al crear la transacción' });
    }
};

// Controlador para obtener transacciones por usuario
export const obtenerTransacciones = async (req: Request, res: Response) => {
    const usuarioId = parseInt(req.params.usuarioId);

    try {
        const transacciones = await obtenerTransaccionesPorUsuario(usuarioId);
        res.status(200).json(transacciones);
    } catch (error) {
        console.error('Error al obtener las transacciones:', error);
        res.status(500).json({ error: 'Error al obtener las transacciones' });
    }
};

// Controlador para obtener todas las transacciones
export const obtenerTodasLasTransacciones = async (req: Request, res: Response) => {
    try {
        const transacciones = await obtenerallTransacciones();
        res.status(200).json(transacciones);
    } catch (error) {
        console.error('Error al obtener todas las transacciones:', error);
        res.status(500).json({ error: 'Error al obtener todas las transacciones' });
    }
};

// Controlador para obtener una transacción por ID
export const obtenerTransaccionPorId = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    try {
        const transaccion = await obtenerTransaccionPorIdModelo(id); // Usar la función renombrada
        if (transaccion) {
            res.status(200).json(transaccion);
        } else {
            res.status(404).json({ error: 'Transacción no encontrada' });
        }
    } catch (error) {
        console.error('Error al obtener la transacción:', error);
        res.status(500).json({ error: 'Error al obtener la transacción' });
    }
};

// Controlador para eliminar una transacción
export const eliminarTransaccion = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    try {
        await deleteTransaction(id);
        res.status(204).send(); // No content
    } catch (error) {
        console.error('Error al eliminar la transacción:', error);
        res.status(500).json({ error: 'Error al eliminar la transacción' });
    }
};
