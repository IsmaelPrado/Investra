// src/index.ts
import 'dotenv/config'; // Para cargar variables de entorno
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import userRoutes from './routes/userRoutes';
import newsRoutes from './routes/newsRoutes';
import transactionRoutes from './routes/transactionRoutes';
import paymentMethodRoutes from './routes/paymentMethodRoutes';
import courseRoutes from './routes/courseRoutes';

import courseContentRoutes from './routes/courseContentRoutes';

import simulationRoutes from './routes/Simulation/simulationRoutes';
import { iniciarSimulacion } from './controllers/Simulation/simulationController';
import pool from './config'; // Asegúrate de que 'pool' esté correctamente configurado
import { crearTablas } from './utils/createTables'; // Opcional: Crear tablas si no existen
import buyAssetsRoutes from './routes/Simulation/buyAssetsRoutes';
import interviewRoutes from './routes/interviewRoutes';
import assetRoutes from './routes/Simulation/assetRoutes';
import historyAssetsRoutes from './routes/Simulation/historyAssetsRoutes';

import iniciarProcesamientoBonosVencidos from '../src/models/Simulation/cronModel';

const app = express();

// Crear un servidor HTTP con Express
const httpServer = createServer(app);

// Configurar Socket.IO para el servidor HTTP
const io = new Server(httpServer, {
    cors: {
        origin: "*", // Cambia esto según tu frontend
        methods: ["GET", "POST"],
        allowedHeaders:['Content-Type', 'Authorization']
    }
});


// Middleware de CORS
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

// Rutas de la API
app.use('/usuarios', userRoutes);
app.use(newsRoutes);
app.use('/transacciones', transactionRoutes);
app.use('/paymethod', paymentMethodRoutes);

app.use('/course', courseRoutes)
app.use('/coursePurchased', courseContentRoutes);

app.use('/api', assetRoutes); // Añadir assetRoutes bajo /api
app.use('/', historyAssetsRoutes);

app.use('/api/simulacion', simulationRoutes); // Añadir simulationRoutes bajo /api/simulacion
app.use('/', buyAssetsRoutes);
app.use('/encuesta', interviewRoutes);

// Escuchar eventos de conexión en el servidor de Socket.IO
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado:', socket.id);
    
    socket.on('error', (err) => {
        console.error('Error en el socket:', err);
    });

    socket.on('disconnect', (reason) => {
        console.log('Cliente desconectado:', socket.id, 'Razón:', reason);
    });
});

// Iniciar el procesamiento de bonos vencidos con Socket.IO
iniciarProcesamientoBonosVencidos(io);
// Iniciar la simulación de inversiones
iniciarSimulacion(io);

// Opcional: Crear tablas si no existen
crearTablas();

// Iniciar el servidor HTTP
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
