// interviewProfileService.ts
import axios from 'axios';

export interface EncuestaPregunta {
    id: number;
    texto: string;
    tipo_respuesta: string;
}
export interface Respuesta {
    id_pregunta: number;
    respuesta: string;
}

export interface GuardarRespuestasRequest {
    id_usuario: number;
    respuestas: Respuesta[];
}

// URL de la API
const API_URL_PREGUNTAS = 'http://localhost:3000/encuesta/preguntas';
const API_URL_RESPUESTAS = 'http://localhost:3000/encuesta/respuestas';

// Función para obtener las preguntas de la encuesta
export const obtenerPreguntasEncuesta = async (): Promise<EncuestaPregunta[]> => {
    try {
        const response = await axios.get<EncuestaPregunta[]>(API_URL_PREGUNTAS);
        return response.data;
    } catch (error) {
        console.error("Error al obtener las preguntas de la encuesta:", error);
        throw error; // O puedes manejar el error como prefieras
    }
};

// Función para guardar las respuestas de la encuesta
export const guardarRespuestasEncuesta = async (data: GuardarRespuestasRequest): Promise<void> => {
    try {
        const response = await axios.post(API_URL_RESPUESTAS, data);
        console.log('Respuestas guardadas exitosamente:', response.data);
    } catch (error) {
        console.error("Error al guardar las respuestas de la encuesta:", error);
        throw error;
    }
};

// URL de la API para recomendaciones
const API_URL_RECOMENDACIONES = 'http://localhost:3000/encuesta/recomendaciones';

// Función para obtener las recomendaciones de activos
export const obtenerRecomendaciones = async (id_usuario: number) => {
    try {
        const response = await axios.get(`${API_URL_RECOMENDACIONES}/${id_usuario}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener las recomendaciones:", error);
        throw error; // O puedes manejar el error como prefieras
    }
};

