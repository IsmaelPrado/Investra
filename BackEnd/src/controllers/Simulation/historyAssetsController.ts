import { Request, Response } from 'express';
import { crearHistorialInversion, obtenerHistorialPorUsuario } from '../../models/Simulation/historyAssetsModel';


// Controlador para crear un nuevo historial de inversión
export const crearHistorial = async (req: Request, res: Response): Promise<void> => {
    try {
        const { historialData, compraActivoId } = req.body; // Ahora recibimos ambos datos desde el cuerpo de la solicitud
        const nuevoHistorial = await crearHistorialInversion(historialData, compraActivoId);
        res.status(201).json(nuevoHistorial); // Respuesta con el nuevo historial creado
    } catch (error) {
        console.error('Error al crear el historial:', error);
        res.status(500).json({ message: 'Error al crear el historial de inversión' });
    }
};


// Controlador para obtener el historial de inversiones por usuario
export const obtenerHistorial = async (req: Request, res: Response): Promise<void> => {
    const usuarioId = parseInt(req.params.id); // Obtener el ID del usuario desde los parámetros de la ruta
    try {
        const historial = await obtenerHistorialPorUsuario(usuarioId);
        res.status(200).json(historial); // Respuesta con el historial encontrado
    } catch (error) {
        console.error('Error al obtener el historial:', error);
        res.status(500).json({ message: 'Error al obtener el historial de inversiones' });
    }
};
