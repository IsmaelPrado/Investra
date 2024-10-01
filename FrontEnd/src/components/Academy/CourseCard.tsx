// src/components/CourseCard.tsx
import React from 'react';

interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
  instructor: string;
  level: string;
  rating: number;
  price: string;
}

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden transition-transform transform hover:scale-105 w-full">
      <img
        src={course.image}
        alt={course.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold text-white hover:text-blue-400 transition-colors duration-200">{course.title}</h2>
        <p className="text-gray-400 mt-1">
          <strong>Instructor:</strong> {course.instructor}
        </p>
        <p className="text-gray-400">
          <strong>Nivel:</strong> {course.level}
        </p>
        <p className="text-yellow-400">
          <strong>Calificación:</strong> {course.rating} ⭐
        </p>
        <p className="text-green-400">
          <strong>Precio:</strong> {course.price}
        </p>
        <p className="text-gray-300 my-2">{course.description}</p>
        <a
          href={`/courses/${course.id}`} // Ajusta la ruta según tu enrutamiento
          className="inline-block mt-3 text-blue-400 hover:text-blue-600 font-bold"
        >
          Ver curso
        </a>
      </div>
    </div>
  );
};

export default CourseCard;
