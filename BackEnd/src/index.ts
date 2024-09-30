// src/index.ts
import express from 'express';
import cors from 'cors'; // Middleware para habilitar CORS (Cross-Origin Resource Sharing)
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();

// Configuración de CORS
app.use(cors()); // Permite todas las solicitudes CORS

const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Usar las rutas de usuarios
app.use('/usuarios', userRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
