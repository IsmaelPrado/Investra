// src/controllers/assetController.ts
import { Request, Response } from 'express';
import { obtenerTodosLosActivos, crearActivo, actualizarPrecioActivo, obtenerActivoPorId } from '../../models/Simulation/assetModel';
import { crearHistorialPrecio } from '../../models/Simulation/priceHistoryModel';

export const getAssets = async (req: Request, res: Response): Promise<Response> => {
    try {
        const activos = await obtenerTodosLosActivos();
        return res.status(200).json(activos);
    } catch (error) {
        console.error('Error al obtener activos:', error);
        return res.status(500).json({ message: 'Error al obtener activos.' });
    }
};

export const createAsset = async (req: Request, res: Response): Promise<Response> => {
    const { nombre, tipo, precio, min_variacion, max_variacion } = req.body;

    if (!nombre || !tipo || !precio || !min_variacion || !max_variacion) {
        return res.status(400).json({ message: 'Datos de activo incompletos.' });
    }

    try {
        const nuevoActivo = await crearActivo({ nombre, tipo, precio, min_variacion, max_variacion });
        return res.status(201).json({ message: 'Activo creado exitosamente.', activo: nuevoActivo });
    } catch (error) {
        console.error('Error al crear activo:', error);
        return res.status(500).json({ message: 'Error al crear activo.' });
    }
};

// Controlador para obtener un activo por ID
export const getAssetById = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    try {
        const asset = await obtenerActivoPorId(parseInt(id));
        if (!asset) {
            return res.status(404).json({ error: 'Activo no encontrado' });
        }
        return res.status(200).json(asset);
    } catch (error) {
        console.error('Error al obtener activo por ID:', error);
        return res.status(500).json({ error: 'Error al obtener activo' });
    }
};
