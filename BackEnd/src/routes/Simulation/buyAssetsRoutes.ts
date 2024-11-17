import express from 'express';
import { handleActualizarEstadoCompra, handleCrearCompraAccion, handleCrearCompraBono, handleObtenerCompraPorId, handleObtenerComprasPorUsuario } from '../../controllers/Simulation/buyAssetsController';


const router = express.Router();

// Rutas para las compras de activos
router.post('/compras/accion', handleCrearCompraAccion);
router.post('/compras/bono', handleCrearCompraBono);
router.get('/compras/:id', handleObtenerCompraPorId);
router.put('/compras/:id/estado', handleActualizarEstadoCompra);
router.get('/compras/usuario/:usuarioId', handleObtenerComprasPorUsuario);

export default router;
