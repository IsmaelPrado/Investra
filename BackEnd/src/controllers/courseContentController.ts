// src/controllers/CourseController.ts
import { Request, Response } from 'express';
import { getCourseDetailsByIds, getModules, getPurchasedCourseIds, getSubmodules } from '../models/courseContent';

export const obtenerCursosComprados = async (req: Request, res: Response) => {
    const { userId } = req.body; // Obtener el userId del cuerpo de la solicitud

    try {
        const courseIds = await getPurchasedCourseIds(userId); // Llamar al método del modelo
        res.status(200).json(courseIds); // Devolver los IDs de los cursos en formato JSON
    } catch (error) {
        console.error('Error al obtener los IDs de los cursos comprados:', error);
        res.status(500).json({ error: 'Error al obtener los cursos comprados' });
    }
};


// Controlador para obtener los detalles de los cursos comprados
export const obtenerDetallesCursosComprados = async (req: Request, res: Response) => {
    const { userId } = req.body; // Obtener el userId del cuerpo de la solicitud

    try {
        // Paso 1: Obtener los IDs de los cursos comprados
        const courseIds = await getPurchasedCourseIds(userId); 
        if (courseIds.length === 0) {
            return res.status(404).json({ message: 'No se encontraron cursos comprados' });
        }

        // Paso 2: Obtener los detalles de los cursos a partir de los IDs obtenidos
        const cursosDetalles = await getCourseDetailsByIds(courseIds); 
        res.status(200).json(cursosDetalles); // Devolver los detalles de los cursos en formato JSON
    } catch (error) {
        console.error('Error al obtener los detalles de los cursos comprados:', error);
        res.status(500).json({ error: 'Error al obtener los detalles de los cursos comprados' });
    }
};


// Controlador para obtener módulos de un curso específico
export const obtenerModulosCursoEspecifico = async (req: Request, res: Response) => {
    const { courseId } = req.body; // Obtener el courseId del cuerpo de la solicitud

    try {
        const modulos = await getModules(courseId); // Llamar al método del modelo
        if (modulos.length === 0) {
            return res.status(404).json({ message: 'No se encontraron módulos para este curso' });
        }
        res.status(200).json(modulos); // Devolver los módulos en formato JSON
    } catch (error) {
        console.error('Error al obtener los módulos del curso:', error);
        res.status(500).json({ error: 'Error al obtener los módulos del curso' });
    }
};


// Controlador para obtener submódulos de un curso específico
export const obtenerSubmodulosCursoEspecifico = async (req: Request, res: Response) => {
    const { courseId } = req.body; // Obtener el courseId del cuerpo de la solicitud

    try {
        const submodulos = await getSubmodules(courseId); // Llamar al método del modelo
        if (submodulos.length === 0) {
            return res.status(404).json({ message: 'No se encontraron submódulos para este curso' });
        }
        res.status(200).json(submodulos); // Devolver los submódulos en formato JSON
    } catch (error) {
        console.error('Error al obtener los submódulos del curso:', error);
        res.status(500).json({ error: 'Error al obtener los submódulos del curso' });
    }
};


