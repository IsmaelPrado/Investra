import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate, useParams } from 'react-router-dom';
import Header from './components/Header';
import InvestmentForm from './components/Investment/InvestmentForm';
import LoginForm from './components/Authentication/LoginForm';
import './index.css';
import RegisterForm from './components/Authentication/RegisterForm';
import { UserProvider } from './context/UserContext';
import React, { useEffect, useState } from 'react';
import PrivateRoute from './components/Authentication/PrivateRoute'; // Importa el componente PrivateRoute
import PublicRoute from './components/Authentication/PublicRoute'; // Importa el componente PublicRoute
import 'toastr/build/toastr.min.css'; // Importar estilos de Toastr
import Academy from './components/Academy/Academy';
import { useNavigate } from 'react-router-dom';  // Asegúrate de importar useNavigate
import CourseDetails from './components/Academy/CourseDetails/CourseDetails';
import Compras from './components/Academy/CoursesPurchased';
import CourseContent from './components/Academy/CourseContentModules';
import DashboardInversiones from './components/Dashboard/DashboardInversiones';
import InversionesList from './components/Simulation/InvestmentList';
import { SocketProvider } from './context/SocketContext';
import { fetchPurchasedCourses } from './services/coursePurchasedService';
import { io } from 'socket.io-client';
import { loginUserWithEmail } from './services/userService';
import { showToast } from './services/toastrService';


const socket = io('http://localhost:3000'); // Cambia esta URL si tu servidor está en otro host o puerto


const App: React.FC = () => {
  return (
    <UserProvider>
      <SocketProvider>
        <Router>
          <AppRoutes />
        </Router>
      </SocketProvider>
    </UserProvider>
  );
};

const AppRoutes: React.FC = () => {
  const [userName, setUserName] = useState("");
  const [userBalance, setUserBalance] = useState(0);
  const [userId, setUserId] = useState(0);
  const navigate = useNavigate(); // Ahora puedes usar useNavigate aquí
  const [purchasedCourses, setPurchasedCourses] = useState<number[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const currentPath = window.location.pathname;

    // Escuchar el evento del socket antes de cualquier otra lógica
    const handleBonosActualizados = async (bonosVencidos: any[]) => {
      console.log(`Cantidad de bonos vencidos: ${bonosVencidos.length}`, bonosVencidos);

      if (bonosVencidos.length > 0) {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.removeItem('user');

       
        console.log(`User: ${user}`, user);
        if (user.correo) {
          try {
            const loginResponse = await loginUserWithEmail(user?.correo);
            localStorage.setItem("user", JSON.stringify(loginResponse.usuario));
            window.location.reload();
        } catch {
            showToast('El token ha expirado vuelve a iniciar sesión', 'warning');
            window.location.reload();
        }
        }
      }
    };

    socket.on('bonosActualizados', handleBonosActualizados);

    // Lógica de carga de usuario después de configurar el evento del socket
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.nombre || "");
      setUserBalance(Number(user.saldo) || 0);
      setUserId(Number(user.id) || 0);

      fetchPurchasedCourses(user.id)
        .then((courses) => {
          setPurchasedCourses(courses.map((course: { id: number }) => course.id));
        })
        .catch((error) => {
          console.error("Error al obtener los cursos comprados:", error);
        });

      if (currentPath === "/" || currentPath === "/login") {
        navigate("/invertir");
      }
    } else if (currentPath !== "/login" && currentPath !== "/registro") {
      navigate("/login");
    }

    // Limpiar el evento cuando el componente se desmonte
    return () => {
      socket.off('bonosActualizados', handleBonosActualizados);
    };
  }, [navigate]);
  

  // Función para verificar si un curso ha sido comprado
  const isCoursePurchased = (courseId: number) => purchasedCourses.includes(courseId);

  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />

      {/* Usa el componente PrivateRoute para proteger las rutas */}
      <Route element={<PrivateRoute />}>
        <Route
          path="/dashboard"
          element={
            <>
              <Header /> {/* Header solo aparece en rutas privadas */}
              <DashboardInversiones usuarioId={userId} />
            </>
          }
        />
        <Route
          path="/invertir"
          element={
            <>
              <Header /> {/* Header solo aparece en rutas privadas */}
              <InvestmentForm userName={userName} userBalance={userBalance} />
            </>
          }
        />
        <Route
          path="/academia"
          element={
            <>
              <Header /> {/* Header solo aparece en rutas privadas */}
              <Academy />
            </>
          }
        />
        <Route
          path="/compras"
          element={
            <>
              <Header /> {/* Header solo aparece en rutas privadas */}
              <Compras />
            </>
          }
        />
        <Route
          path="/courses/:courseId"
          element={
            <>
              <Header />
              {/* Extraer courseId desde useParams */}
              <CourseDetails/>
            </>
          }
        />
        <Route
          path="courseContent/:courseId"
          element={
            <>
              <Header /> {/* Header solo aparece en rutas privadas */}
              <CourseContent />
            </>
          }
        />
      </Route>

      <Route
        path="/mis-inversiones"
        element={
          <>
            <Header />
            <InversionesList usuarioId={12} /> {/* Cambia el usuarioId según sea necesario */}
          </>
        }
      />

      {/* Usa el componente PublicRoute para proteger las rutas de login y registro */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/registro" element={<RegisterForm />} />
      </Route>

      {/* Redirigir a login si no hay usuario y se intenta acceder a rutas protegidas */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
