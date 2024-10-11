// src/components/CourseDetails.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchCourses } from '../../../services/courseService';

export interface Course {
  cursoid: number;
  nombre: string;
  descripcion: string;
  precio: string;
  duracion: number;
  urlimagen: string;
  fechacreacion: string;
  calificacion: string;
  nivel: string;
  autor: string;
  idioma: string;
  aprendizajes: {
    titulo: string;
    descripcion: string;
  }[];
}

const CourseDetails: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getCourseDetails = async () => {
      try {
        const coursesData = await fetchCourses();
        const selectedCourse = coursesData.find((c: Course) => c.cursoid === Number(courseId));
        setCourse(selectedCourse);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching course details:', error);
        setError('Error al cargar los detalles del curso.');
        setLoading(false);
      }
    };

    getCourseDetails();
  }, [courseId]);

  if (loading) {
    return <p className="text-center text-gray-400">Cargando detalles del curso...</p>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  if (!course) {
    return <div className="text-center text-red-600">Curso no encontrado.</div>;
  }

  return (
    <div className="main-content min-h-screen w-full bg-gray-900 text-white flex flex-col items-center justify-start">
      <div className="w-full max-w-7xl p-6 bg-gray-800 shadow-md rounded-lg mt-10 mx-auto">
        <div className="flex flex-col lg:flex-row items-start lg:items-center mb-6">
          <img
            src={course.urlimagen}
            alt={course.nombre}
            className="w-full lg:w-1/3 h-64 object-cover rounded-lg mb-4 lg:mb-0 lg:mr-6 shadow-lg"
          />
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-4 text-blue-400">{course.nombre}</h1>
            <div className="flex flex-wrap gap-4 text-gray-400 mb-4">
              <span className="font-semibold">Instructor:</span> {course.autor}
              <span className="font-semibold">Nivel:</span> {course.nivel}
              <span className="font-semibold">Calificación:</span> {course.calificacion} ⭐
              <span className="font-semibold">Duración:</span> {course.duracion} horas
            </div>
            <div className="text-green-400 text-2xl mb-2 font-semibold">
              <span>Precio:</span> {course.precio}
            </div>
            <div className="text-gray-500 text-sm mb-2">
              <span className="font-semibold">Fecha de Creación:</span> {new Date(course.fechacreacion).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg mb-6 shadow-inner">
          <h2 className="text-2xl font-bold text-blue-300 mb-3">Descripción del curso</h2>
          <p className="text-gray-300">{course.descripcion}</p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow-inner">
          <h2 className="text-2xl font-bold text-blue-300 mb-3">Lo que aprenderás</h2>
          <ul className="list-disc list-inside text-gray-300">
            {course.aprendizajes.map((aprendizaje, index) => (
              <li key={index} className="mb-2">
                <span className="font-semibold">{aprendizaje.titulo}: </span>{aprendizaje.descripcion}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
