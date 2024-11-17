import React, { useState } from 'react';
import { Asset } from '../../services/api';
import { comprarActivoService } from '../../services/buyAssetsService';
import { useUser } from '../../context/UserContext';
import { showToast } from '../../services/toastrService';
import { loginUserWithEmail } from '../../services/userService';
import LoadingModal from '../Transaction/LoadingModal';

interface ComprarBonosModalProps {
    activo: Asset | null;
    onClose: () => void;
    onSuccess: () => void;
}

const ComprarBonosModal: React.FC<ComprarBonosModalProps> = ({ activo, onClose, onSuccess }) => {
    const [cantidad, setCantidad] = useState<number>(0);
    const [precioCompra, setPrecioCompra] = useState<number>(activo ? activo.precio : 0);
    const [monto, setMonto] = useState<number>(0);
    const [plazo, setPlazo] = useState<number>(1); // Plazo en horas
    const [error, setError] = useState<string>('');
    const { user } = useUser();
    const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');

        if (monto < 50) {
            setError('El monto mínimo de inversión es de $50.00 MXN');
            return;
        }

        const fechaCompra = new Date();
        const fechaVencimiento = new Date(fechaCompra.getTime() + plazo * 60 * 60 * 1000); // Plazo en horas

        try {
            localStorage.removeItem("user");
            if (user) {
                try {
                    const loginResponse = await loginUserWithEmail(user.correo);
                    localStorage.setItem("user", JSON.stringify(loginResponse.usuario));
                } catch {
                    showToast('El token ha expirado, vuelve a iniciar sesión', 'warning');
                    window.location.reload();
                    return;
                }
            }

            if (user?.saldo && user.saldo >= monto) {
                setIsLoadingModalOpen(true);
                setTimeout(async () => {
                    try {
 // Si se ingresa un monto, se calcula la cantidad
 const cantidadFinal = cantidad > 0 ? cantidad : monto / precioCompra; // Calcula la cantidad basada en el monto
    

                        const compra = {
                            usuario_id: user.id,
                            activo_id: activo!.id,
                            cantidad: cantidadFinal,
                            precio_compra: monto,
                            fecha_compra: fechaCompra,
                            plazo,
                            estado: 'comprado',
                            tipo_activo: 'bono', // O 'bono_organizacional' según sea necesario
                            precio_actual: activo!.precio,
                            ganancia_perdida: monto
                        };

                        await comprarActivoService.crearCompraBono(compra);
                        onSuccess();
                        console.log(compra);
                        setIsLoadingModalOpen(false);
                        onClose();

                        try {
                            const loginResponse = await loginUserWithEmail(user?.correo);
                            localStorage.setItem("user", JSON.stringify(loginResponse.usuario));
                            window.location.reload();
                        } catch {
                            showToast('El token ha expirado vuelve a iniciar sesión', 'warning');
                            window.location.reload();
                        }
                    } catch {
                        showToast('Error al realizar la compra', 'error');
                        setIsLoadingModalOpen(false);
                    }
                }, 3000);
            } else {
                showToast('No tienes fondos suficientes. Deposita fondos o ingresa un monto menor.', 'error');
            }
        } catch (err) {
            console.error(err);
            setError('Error al realizar la compra.');
        }
    };

    if (!activo) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-md text-white">
                <h2 className="text-2xl font-bold mb-4 text-center">Compra Bono {activo.nombre}</h2>
                
                <div className="flex justify-between items-center mb-4 p-4 bg-indigo-800 rounded-lg shadow-inner">
                    <div>
                        <p className="text-sm">Fondos Disponibles:</p>
                        <p className="text-xl font-semibold">${user?.saldo}</p>
                    </div>
                    <div className="bg-purple-500 text-white p-2 rounded-full shadow-md">
                        <i className="fas fa-wallet text-2xl"></i>
                    </div>
                </div>

                {error && <div className="text-red-400 text-center mb-4">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="monto" className="block text-sm font-medium">Monto de Inversión</label>
                        <input
                            type="number"
                            id="monto"
                            value={monto}
                            onChange={(e) => setMonto(Number(e.target.value))}
                            className="mt-1 block w-full border border-transparent bg-indigo-900 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 p-3"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="plazo" className="block text-sm font-medium">Plazo de Inversión (Horas)</label>
                        <select
                            id="plazo"
                            value={plazo}
                            onChange={(e) => setPlazo(Number(e.target.value))}
                            className="mt-1 block w-full border border-transparent bg-indigo-900 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 p-3"
                        >
                            {Array.from({ length: 24 }, (_, i) => i + 1).map(hour => (
                                <option key={hour} value={hour}>{hour} hora{hour > 1 ? 's' : ''}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-between mt-6">
                        <button
                            type="button"
                            className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-500 transition"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-green-700 to-blue-700 text-white px-6 py-2 rounded-lg shadow-md hover:from-green-500 hover:to-blue-600 transition font-semibold"
                        >
                            Comprar
                        </button>
                    </div>
                </form>
            </div>
            <LoadingModal isOpen={isLoadingModalOpen} />
        </div>
    );
};

export default ComprarBonosModal;
