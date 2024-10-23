// src/components/CoursePurchased.tsx
import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import { Course } from './CourseCard';
import { fetchPurchasedCourses } from '../../services/coursePurchasedService';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

const CoursePurchased: React.FC = () => {
  const { user } = useUser();
  const [purchasedCourses, setPurchasedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Inicializa el hook useNavigate

  useEffect(() => {
    const getPurchasedCourses = async () => {
      if (user?.id) {
        try {
          const courses = await fetchPurchasedCourses(user.id);
          setPurchasedCourses(courses);
        } catch (error) {
          if (error instanceof Error) {
            setError(error.message);
          } else {
            setError('Error desconocido');
          }
        } finally {
          setLoading(false);
        }
      }
    };

    getPurchasedCourses();
  }, [user]);

  const handleCourseClick = (courseId: number) => {
    navigate(`/courseContent/${courseId}`); // Redirige a la ruta del contenido del curso
  };

  if (loading) {
    return <p className="text-center text-lg">Cargando cursos comprados...</p>;
  }

  if (error) {
    return <div className="text-red-600 text-center">{`Error: ${error}`}</div>;
  }

  return (
    <div className='main-content mt-16 max-w-7xl mx-auto px-4 py-8'> {/* Espaciado ajustado */}
      <h1 className="text-4xl font-bold mb-8 text-center">Cursos Comprados</h1> {/* Separación del título */}
      {purchasedCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {purchasedCourses.map((course) => (
            <div 
              key={course.cursoid} 
              className="border rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105 mx-auto bg-[#1A5276] text-white cursor-pointer" // Añadido cursor-pointer
              onClick={() => handleCourseClick(course.cursoid)} // Evento onClick
            >
              <img src={course.urlimagen} alt={course.nombre} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{course.nombre}</h2>
                <p className="text-gray-300 mt-2">Autor: {course.autor}</p> {/* Nombre del autor con color diferente */}
                <p className="text-gray-300 mt-2">{course.descripcion}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No tienes cursos comprados.</p>
      )}
    </div>
  );
};

export default CoursePurchased;
