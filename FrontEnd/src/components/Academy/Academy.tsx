// src/components/InvestmentCourses.tsx
import React, { useEffect, useState } from 'react';
import CourseCard from './CourseCard';
import Recommendations from './Recommendations';
import SearchBar from './SearchBar';
import FinancialNews from './FinancialNews';

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

const InvestmentCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    // Generar cursos directamente en el componente
    const fetchCourses = () => {
      try {
        const coursesData: Course[] = [
          {
            id: 1,
            title: 'Introducción a las Inversiones',
            description: 'Aprende los conceptos básicos de las inversiones y cómo empezar.',
            image: 'https://via.placeholder.com/300x180',
            instructor: 'Juan Pérez',
            level: 'Principiante',
            rating: 4.5,
            price: '$50',
          },
          {
            id: 2,
            title: 'Análisis de Acciones',
            description: 'Descubre cómo analizar acciones y seleccionar las mejores oportunidades.',
            image: 'https://via.placeholder.com/300x180',
            instructor: 'Ana Martínez',
            level: 'Intermedio',
            rating: 4.8,
            price: '$75',
          },
          {
            id: 3,
            title: 'Fondos de Inversión',
            description: 'Entiende cómo funcionan los fondos de inversión y sus ventajas.',
            image: 'https://via.placeholder.com/300x180',
            instructor: 'Carlos López',
            level: 'Principiante',
            rating: 4.3,
            price: '$30',
          },
          {
            id: 4,
            title: 'Inversiones en Criptomonedas',
            description: 'Conoce el mundo de las criptomonedas y cómo invertir en ellas.',
            image: 'https://via.placeholder.com/300x180',
            instructor: 'María Gómez',
            level: 'Avanzado',
            rating: 4.9,
            price: '$100',
          },
        ];
        setCourses(coursesData);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center text-lg text-gray-400">Cargando cursos...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center">{`Error: ${error}`}</div>;
  }

  const recommendations = [
    { title: 'Curso Recomendado 1', description: 'Descripción breve de la recomendación.' },
    { title: 'Curso Recomendado 2', description: 'Descripción breve de la recomendación.' },
  ];

  return (
    <div className="flex flex-col lg:flex-row w-full">
      <div className="w-full lg:w-3/4 p-4">
        <h1 className="text-4xl font-bold text-center text-white mb-8">Cursos de Inversiones</h1>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
      <div className='lg:w-1/4 pt-4 pr-4'>
      <Recommendations recommendations={recommendations} />
      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Noticias Financieras</h2>
      <FinancialNews />
      </div>
     
    </div>
  );
};

export default InvestmentCourses;
