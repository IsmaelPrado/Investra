import React from 'react';
import logo from '../../assets/investra.mp4'; // Ajusta la ruta según la ubicación de tu logo

// Componente LoadingModal
const LoadingModal: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 overflow-hidden z-50">
            {/* Video de fondo */}
            <video 
                src={logo}  
                className="absolute top-0 left-0 w-full h-full object-cover filter " 
                autoPlay 
                loop 
                muted
                playsInline
            />
            <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white flex flex-col items-center">
                    {/* Efecto de carga animado */}
                    <div className="loader mb-4"></div>

                    <h2 className="text-xl font-bold mb-2">Realizando transacción...</h2>
                    <p className="mb-4">Por favor, espere un momento.</p>
                </div>
            </div>
        </div>
    );
};

// CSS en línea o en un archivo CSS separado
const styles = `
.loader {
    border: 8px solid rgba(255, 255, 255, 0.1);
    border-left-color: #4A90E2; /* Cambia este color para personalizar */
    border-radius: 50%;
    width: 60px;
    height: 60px;
    animation: spin 1s linear infinite;
    margin: 20px 0;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;

// Agregar los estilos al documento
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default LoadingModal;
