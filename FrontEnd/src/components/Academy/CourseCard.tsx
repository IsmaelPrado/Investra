// src/components/CourseCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

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

interface CourseCardProps {
  course: Course;
  isPurchased: boolean; // Indica si el curso fue comprado
}

const CourseCard: React.FC<CourseCardProps> = ({ course, isPurchased }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/courses/${course.cursoid}`);
  };

  const handleContinueLearning = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que se dispare el evento de navegación general al hacer clic en el botón
    navigate(`/courseContent/${course.cursoid}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden transition-transform transform hover:scale-105 w-full h-full cursor-pointer relative"
    >
      {isPurchased && (
        <div className="absolute top-0 left-0 bg-green-600 text-white text-xs px-2 py-1">
          Curso comprado
        </div>
      )}
      <img
        src={course.urlimagen}
        alt={course.nombre}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold text-white hover:text-blue-400 transition-colors duration-200">
          {course.nombre}
        </h2>
        <p className="text-gray-400 mt-1">
          <strong>Instructor:</strong> {course.autor}
        </p>
        <p className="text-gray-400">
          <strong>Nivel:</strong> {course.nivel}
        </p>
        <p className="text-yellow-400">
          <strong>Calificación:</strong> {course.calificacion} ⭐
        </p>
        <p className="text-green-400">
          <strong>Precio:</strong> {course.precio}
        </p>
        <p className="text-gray-300 my-2">{course.descripcion}</p>
        <p className="text-gray-500 text-sm">
          <strong>Fecha de Creación:</strong> {course.fechacreacion}
        </p>
        {isPurchased && (
          <button
            onClick={handleContinueLearning}
            className="mt-4 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition-colors w-full"
          >
            Continuar aprendiendo
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
