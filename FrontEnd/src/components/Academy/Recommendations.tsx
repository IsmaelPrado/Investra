// src/components/Recommendations.tsx
import React, { useEffect, useState } from 'react';

interface Recommendation {
  title: string;
  description: string;
}

interface RecommendationsProps {
  recommendations: Recommendation[];
}

const Recommendations: React.FC<RecommendationsProps> = ({ recommendations }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === recommendations.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000); // Cambia cada 10 segundos

    return () => clearInterval(interval); // Limpiar el intervalo cuando el componente se desmonta
  }, [recommendations.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? recommendations.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === recommendations.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="w-full pt-6">
      <h2 className="text-2xl font-bold text-white mb-4">Recomendaciones</h2>
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4"
              style={{ minWidth: '100%' }} // Para que cada tarjeta ocupe el 100% del ancho
            >
              <h3 className="text-lg text-white">{rec.title}</h3>
              <p className="text-gray-400">{rec.description}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Botones de navegación debajo del carrusel */}
      <div className="flex justify-between mt-4">
        <button
          className="bg-gray-700 text-white px-3 py-2 rounded-md hover:bg-gray-600 transition duration-200"
          onClick={goToPrevious}
        >
          &lt; Anterior
        </button>
        <button
          className="bg-gray-700 text-white px-3 py-2 rounded-md hover:bg-gray-600 transition duration-200"
          onClick={goToNext}
        >
          Siguiente &gt;
        </button>
      </div>
    </div>
  );
};

export default Recommendations;
