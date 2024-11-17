import { Request, Response } from 'express';
import {
    crearCompraAccion,
    crearCompraBono,
    obtenerCompraPorId,
    actualizarEstadoCompra,
    obtenerComprasPorUsuario
} from '../../models/Simulation/buyAssetsModel'; // Asegúrate de que la ruta sea correcta

export const handleCrearCompraAccion = async (req: Request, res: Response): Promise<void> => {
    try {
        const compra = req.body;

        // Calcula el total basado en la cantidad y el precio por acción
        const total = compra.cantidad * compra.precio_compra;

        // Crea la nueva compra
        const nuevaCompra = await crearCompraAccion(compra);


console.log(total)
        res.status(201).json(nuevaCompra);
    } catch (error) {
        res.status(400).json({ error: error });
    }
};


// Controlador para crear una compra de bono
export const handleCrearCompraBono = async (req: Request, res: Response): Promise<void> => {
    try {
        const compra = req.body; // Recibir el cuerpo de la solicitud
        const { plazo, ...restoCompra } = compra; // Separar plazo del resto de los datos

        // Calcular fecha de vencimiento sumando el plazo (en horas)
        const fechaCompra = new Date();
        const fechaVencimiento = new Date(fechaCompra.getTime() + plazo * 60 * 60 * 1000);

        // Agregar fecha de vencimiento calculada al objeto compra
        const compraConFecha = { ...restoCompra, fecha_vencimiento: fechaVencimiento };

        // Crear la compra de bono
        const nuevaCompra = await crearCompraBono(compraConFecha);
        res.status(201).json(nuevaCompra);
    } catch (error) {
        res.status(400).json({ error: error });
    }
};

// Controlador para obtener una compra por ID
export const handleObtenerCompraPorId = async (req: Request, res: Response): Promise<void> => {
    try {
        const compraId = parseInt(req.params.id);
        const compra = await obtenerCompraPorId(compraId);
        if (compra) {
            res.status(200).json(compra);
        } else {
            res.status(404).json({ message: 'Compra no encontrada' });
        }
    } catch (error) {
        res.status(400).json({ error: error });
    }
};

// Controlador para actualizar el estado de una compra
export const handleActualizarEstadoCompra = async (req: Request, res: Response): Promise<void> => {
    try {
        const compraId = parseInt(req.params.id);
        const { estado, fecha_venta } = req.body; // Asegúrate de que el cuerpo tenga el formato correcto
        await actualizarEstadoCompra(compraId, estado, fecha_venta);
        res.status(200).json({ message: 'Estado de compra actualizado correctamente' });
    } catch (error) {
        res.status(400).json({ error: error });
    }
};

// Controlador para obtener todas las compras de un usuario
export const handleObtenerComprasPorUsuario = async (req: Request, res: Response): Promise<void> => {
    try {
        const usuarioId = parseInt(req.params.usuarioId);
        const compras = await obtenerComprasPorUsuario(usuarioId);
        res.status(200).json(compras);
    } catch (error) {
        res.status(400).json({ error: error });
    }
};
