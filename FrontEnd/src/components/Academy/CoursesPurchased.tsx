import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import { Course } from './CourseCard';
import { fetchPurchasedCourses } from '../../services/coursePurchasedService';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';

const CoursePurchased: React.FC = () => {
    const { user } = useUser();
    const [purchasedCourses, setPurchasedCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getPurchasedCourses = async () => {
            if (user?.id) {
                try {
                    const courses = await fetchPurchasedCourses(user.id);
                    setPurchasedCourses(courses);
                } catch (error) {
                    if (error instanceof AxiosError) {
                        if (error.response && error.response.data) {
                            setError(error.response.data.message);
                        } else {
                            setError('Error al cargar los cursos.');
                        }
                    } else {
                        setError('Sin cursos aún.');
                    }
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false); // Asegúrate de cambiar el estado de loading si no hay usuario
            }
        };

        getPurchasedCourses();
    }, [user]);

    const handleCourseClick = (courseId: number) => {
        navigate(`/courseContent/${courseId}`);
    };

    const handleAcademiaClick = () => {
        navigate('/academia'); // Redirigir a la ruta /academia
    };

    if (loading) {
        return <p className="text-center text-lg text-white">Cargando cursos comprados...</p>;
    }

    // Aquí se decide qué mostrar basado en los cursos comprados y el error
    return (
        <div className='main-content mt-16 max-w-7xl mx-auto px-4 py-8 '>
            <h1 className="text-4xl font-bold mb-8 text-center text-white">Cursos Comprados</h1>
            {error || purchasedCourses.length === 0 ? (
                <div className="main-content flex flex-col items-center justify-center h-48 border border-gray-700 rounded-lg bg-gray-800">
                    <p className="text-lg font-semibold text-gray-300">
                        {error ? error : 'No tienes cursos comprados aún.'}
                    </p>
                    <p className="text-sm text-gray-400">¡Explora nuestros cursos y adquiere alguno!</p>
                    <button 
                        onClick={handleAcademiaClick}
                        className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500 transition duration-200"
                    >
                        Ir a Academia
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {purchasedCourses.map((course) => (
                        <div 
                            key={course.cursoid} 
                            className="border rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105 mx-auto bg-[#1A5276] text-white cursor-pointer"
                            onClick={() => handleCourseClick(course.cursoid)}
                        >
                            <img src={course.urlimagen} alt={course.nombre} className="w-full h-48 object-cover" />
                            <div className="p-4">
                                <h2 className="text-xl font-semibold">{course.nombre}</h2>
                                <p className="text-gray-300 mt-2">Autor: {course.autor}</p>
                                <p className="text-gray-300 mt-2">{course.descripcion}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {/* Botón también para acceder a la academia si hay cursos comprados */}
            {purchasedCourses.length > 0 && (
                <div className="mt-8 text-center">
                    <button 
                        onClick={handleAcademiaClick}
                        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500 transition duration-200"
                    >
                        Ir a Academia
                    </button>
                </div>
            )}
        </div>
    );
};

export default CoursePurchased;
