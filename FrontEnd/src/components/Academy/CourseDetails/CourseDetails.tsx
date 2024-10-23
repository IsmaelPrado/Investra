import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchCourses } from '../../../services/courseService';
import { useUser } from '../../../context/UserContext';
import { purchaseCourse, fetchPurchasedCourses } from '../../../services/coursePurchasedService';
import { showToast } from '../../../services/toastrService';
import ConfirmationModal from '../../Transaction/ConfirmationModal';
import { loginUserWithEmail } from '../../../services/userService';
import LoadingModal from '../../Transaction/LoadingModal';

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
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const [isPurchased, setIsPurchased] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isPurchasing, setIsPurchasing] = useState<boolean>(false);
  const [confirmationText, setConfirmationText] = useState<string>('');
  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const getCourseDetails = async () => {
      try {
        const coursesData = await fetchCourses();
        const selectedCourse = coursesData.find((c: Course) => c.cursoid === Number(courseId));
        setCourse(selectedCourse);

        // Check if the user has purchased this course
        if (user) {
          const purchasedCourses = await fetchPurchasedCourses(user.id);
          const isCoursePurchased = purchasedCourses.some((p: { cursoid: number }) => p.cursoid === selectedCourse.cursoid);
          setIsPurchased(isCoursePurchased);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching course details:', error);
        setError('Error al cargar los detalles del curso.');
        setLoading(false);
      }
    };

    getCourseDetails();
  }, [courseId, user]);

  const handleBuyCourse = () => {
    if (user && course) {
      setConfirmationText(`¿Estás seguro de que deseas comprar el curso "${course.nombre}" por ${course.precio}?`);
      setIsModalOpen(true);
    }
  };

  const confirmPurchase = async () => {
    setIsPurchasing(true);
    setIsLoadingModalOpen(true);
    try {
      if (user?.id && course?.cursoid) {
        localStorage.removeItem("user");
        try {
          const loginResponse = await loginUserWithEmail(user?.correo);
          localStorage.setItem("user", JSON.stringify(loginResponse.usuario));
        } catch (error) {
          showToast('El token ha expirado. Por favor, vuelve a iniciar sesión.', 'warning');
          window.location.reload();
          return;
        }

        await purchaseCourse(user.id, course.cursoid);
        await new Promise(resolve => setTimeout(resolve, 3000));
        showToast("Compra exitosa de: " + course.nombre, "success");

        // Re-fetch purchased courses to update the state
        const purchasedCourses = await fetchPurchasedCourses(user.id);
        const isCoursePurchased = purchasedCourses.some((p: { cursoid: number }) => p.cursoid === course.cursoid);
        setIsPurchased(isCoursePurchased);

        localStorage.removeItem("user");
        try {
          const loginResponse = await loginUserWithEmail(user?.correo);
          localStorage.setItem("user", JSON.stringify(loginResponse.usuario));
          window.location.reload();
        } catch (error) {
          showToast('Error al volver a iniciar sesión. Por favor, intenta nuevamente.', 'error');
          window.location.reload();
        }
      } else {
        showToast("Error al comprar curso", "error");
      }
    } catch (error) {
      console.error('Error al realizar la compra:', error);
      showToast("Error en la compra del curso: " + course?.nombre, "error");
    } finally {
      setIsLoadingModalOpen(false);
      setIsPurchasing(false);
    }
  };

  const cancelPurchase = () => {
    setIsModalOpen(false);
  };

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
    <div className="min-h-screen w-full bg-gray-900 text-white p-8 flex justify-center mt-14">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row">
        <div className="lg:w-2/3 p-4">
          <img src={course.urlimagen} alt={course.nombre} className="w-full h-80 object-cover rounded-lg mb-6" />
          <h1 className="text-4xl font-bold text-blue-400 mb-4">{course.nombre}</h1>
          <p className="text-gray-300 text-lg mb-4">{course.descripcion}</p>
          <div className="flex flex-wrap gap-8 text-gray-400 mb-6">
            <div className="flex items-center">
              <span className="material-icons mr-2">person</span>
              <span className="font-semibold">Instructor:</span> {course.autor}
            </div>
            <div className="flex items-center">
              <span className="material-icons mr-2">star</span>
              <span className="font-semibold">Nivel:</span> {course.nivel}
            </div>
            <div className="flex items-center">
              <span className="material-icons mr-2">schedule</span>
              <span className="font-semibold">Duración:</span> {course.duracion} horas
            </div>
            <div className="flex items-center">
              <span className="material-icons mr-2">language</span>
              <span className="font-semibold">Idioma:</span> {course.idioma}
            </div>
            <div className="flex items-center">
              <span className="material-icons mr-2">star_rate</span>
              <span className="font-semibold">Calificación:</span> {course.calificacion} ⭐
            </div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg mb-6">
            <h2 className="text-2xl font-bold text-blue-300 mb-3">Lo que aprenderás</h2>
            <ul className="list-disc list-inside text-gray-300 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {course.aprendizajes.map((aprendizaje, index) => (
                <li key={index} className="mb-2">
                  <span className="font-semibold text-green-400">{aprendizaje.titulo}: </span>{aprendizaje.descripcion}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:w-1/3 lg:ml-8 p-4 sticky top-8 self-start bg-gray-800 rounded-lg shadow-lg">
          {isPurchased ? (
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500 mb-4">Curso comprado</div>
              <button
                onClick={() => navigate(`/courseContent/${course.cursoid}`)}
                className="bg-blue-600 text-white py-4 px-6 rounded-lg w-full hover:bg-blue-700 transition duration-300 mb-4 text-xl font-semibold"
              >
                Continuar aprendiendo
              </button>
            </div>
          ) : (
            <>
              <div className="text-4xl font-bold text-green-400 mb-4 flex items-center">
                <span className='text-2xl '>Precio:</span>
                <span className="material-icons">attach_money</span>
                <span className="">{course.precio}</span>
              </div>
              <button
                onClick={handleBuyCourse}
                className="bg-blue-600 text-white py-4 px-6 rounded-lg w-full hover:bg-blue-700 transition duration-300 mb-4 text-xl font-semibold"
              >
                Comprar curso
              </button>
            </>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onCancel={cancelPurchase}
        onConfirm={confirmPurchase}
        text={confirmationText}
      />
      <LoadingModal isOpen={isLoadingModalOpen}  />
    </div>
  );
};

export default CourseDetails;
