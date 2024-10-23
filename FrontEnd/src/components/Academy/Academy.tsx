import React, { useEffect, useState } from 'react';
import CourseCard from './CourseCard';
import Recommendations from './Recommendations';
import SearchBar from './SearchBar';
import FinancialNews from './FinancialNews';
import { fetchCourses } from '../../services/courseService';
import { fetchPurchasedCourses } from '../../services/coursePurchasedService';
import { useUser } from '../../context/UserContext';

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

const InvestmentCourses: React.FC = () => {
  const { user } = useUser();
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [purchasedCourses, setPurchasedCourses] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getCourses = async () => {
      try {
        const coursesData = await fetchCourses();
        setCourses(coursesData);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError('Error al cargar los cursos');
      } finally {
        setLoading(false);
      }
    };

    const getPurchasedCourses = async () => {
      if (user?.id) {
        try {
          const purchasedData = await fetchPurchasedCourses(user.id);
          const purchasedIds = purchasedData.map((course: Course) => course.cursoid);
          setPurchasedCourses(purchasedIds);
        } catch (error) {
          console.error('Error fetching purchased courses:', error);
          // Handle error but don't set state to avoid stopping rendering
        }
      }
    };

    getCourses();
    getPurchasedCourses();
  }, [user?.id]);

  const filteredCourses = courses.filter(course =>
    course.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const recommendations = [
    { title: 'Curso Recomendado 1', description: 'Descripción breve de la recomendación.' },
    { title: 'Curso Recomendado 2', description: 'Descripción breve de la recomendación.' },
  ];

  if (loading) {
    return <p className="text-center text-lg text-gray-400">Cargando cursos...</p>;
  }

  return (
    <div className="main-content flex flex-col lg:flex-row w-full">
      <div className="w-full lg:w-3/4 p-4">
        <h1 className="text-4xl font-bold text-center text-white mb-8">Cursos de Inversiones</h1>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 min-h-[180px]">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <CourseCard
                key={course.cursoid}
                course={course}
                isPurchased={purchasedCourses.includes(course.cursoid)}
              />
            ))
          ) : (
            <div className="col-span-1 text-center text-gray-400">
              No se encontraron cursos.
            </div>
          )}
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
