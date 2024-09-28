import React from 'react';
import { Link } from 'react-router-dom';
import Investra from '../assets/Investra.png';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 p-4 text-white shadow-lg z-50">
      <nav className="flex justify-between items-center">
        <div className="flex items-center ml-4"> {/* Añadido margen a la izquierda */}
          <Link to="/">
            <img src={Investra} alt="Investra logo" className="w-32 h-auto" />
          </Link>
        </div>
        <ul className="flex space-x-4 mr-4"> {/* Ajustado el margen a la derecha */}
          <li>
            <Link to="/inversiones" className="text-lg font-bold hover:text-blue-400">Invertir</Link>
          </li>
          <li>
            <Link to="/perfil" className="text-lg font-bold hover:text-blue-400">Perfil</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
