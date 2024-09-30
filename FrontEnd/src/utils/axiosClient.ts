// src/utils/axiosClient.ts
import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:3000', // Cambia esto por la URL de tu backend
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosClient;
