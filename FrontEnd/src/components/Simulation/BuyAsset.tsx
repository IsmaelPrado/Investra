import React, { useState, useEffect } from 'react';
import { Asset } from '../../services/api';
import { comprarActivoService } from '../../services/buyAssetsService';
import { useUser } from '../../context/UserContext';
import { showToast } from '../../services/toastrService';
import { loginUserWithEmail } from '../../services/userService';
import LoadingModal from '../Transaction/LoadingModal';

interface ComprarAccionesModalProps {
    activo: Asset | null;
    onClose: () => void;
    onSuccess: () => void;
}

const ComprarAccionesModal: React.FC<ComprarAccionesModalProps> = ({ activo, onClose, onSuccess }) => {
    const [cantidad, setCantidad] = useState<number>(0);
    const [precioCompra, setPrecioCompra] = useState<number>(activo ? activo.precio : 0);
    const [monto, setMonto] = useState<number>(0); // Monto que el usuario desea gastar
    const [total, setTotal] = useState<number>(0);
    const [error, setError] = useState<string>('');
    const { user } = useUser();
    const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);

    // Actualiza el total cada vez que cambie la cantidad, el precio por acción o el monto
    useEffect(() => {
        if (monto > 0) {
            setCantidad(monto / precioCompra); // Calcula la cantidad basada en el monto
        } else {
            setTotal(cantidad * precioCompra); // Calcula el total basado en la cantidad
        }
    }, [cantidad, precioCompra, monto]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
    
        // Verifica que se haya ingresado un monto o una cantidad válida
        if (cantidad <= 0 && monto <= 0) {
            setError('La cantidad o el monto deben ser mayores que cero.');
            return;
        }
    
        try {

            localStorage.removeItem("user");
            if(user){
                try{
                    const loginResponse = await loginUserWithEmail(user?.correo);
                    localStorage.setItem("user", JSON.stringify(loginResponse.usuario));
                   
                }catch{
                    showToast('El token ha expirado vuelve a iniciar sesión', 'warning');
                    window.location.reload();
                }
               
            }

            // Si se ingresa un monto, se calcula la cantidad
            const cantidadFinal = cantidad > 0 ? cantidad : monto / precioCompra; // Calcula la cantidad basada en el monto
    
            // Calcula el precio de compra de acuerdo a la cantidad final
            const precioFinalCompra = cantidadFinal * precioCompra; // Precio total por la cantidad
    
            const compra = {
                usuario_id: user?.id,
                activo_id: activo!.id,
                cantidad: cantidadFinal, // Usa la cantidad calculada
                precio_compra: precioFinalCompra, // Usa el precio total calculado
                estado: 'comprado',
                tipo_activo: 'accion',
                precio_actual: activo!.precio,
                gananciaPerdida: precioFinalCompra
            };

            if (user?.saldo) {
                if(precioFinalCompra <50){
                    showToast('El monto mínimo de inversión es de $50.00 MXN', 'warning')
                    
                    return;
                }
                if (user?.saldo >= precioFinalCompra) {
                    setIsLoadingModalOpen(true); // Muestra el modal de carga

                    setTimeout(async () => {
                        try {
                            await comprarActivoService.crearCompraAccion(compra);
                            onSuccess();
                            setIsLoadingModalOpen(false); // Cierra el modal de carga
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
                            showToast('Error, no hay fondos suficientes', 'error');
                        }
                    }, 3000); // Simula el tiempo de espera de 5 segundos
                } else {
                    setError('No tienes fondos suficientes');
                    showToast('No tienes fondos suficientes. Deposita fondos o introduce una cantidad menor para este activo', 'error');
                }
            }
           
           
        } catch (err) {
            setError('Error al realizar la compra.');
            console.error(err);
        }
    };
    

    if (!activo) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-md text-white">
                <h2 className="text-2xl font-bold mb-4 text-center">Compra {activo?.nombre}</h2>
                
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
                        <label htmlFor="cantidad" className="block text-sm font-medium">Por Acciones</label>
                        <input
                            type="text"
                            id="cantidad"
                            value={cantidad > 0 ? cantidad : ''}
                            onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                if (!isNaN(value)) {
                                    setCantidad(value);
                                    setMonto(0);
                                }
                            }}
                            className="mt-1 block w-full border border-transparent bg-indigo-900 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 p-3"
                        />
                    </div>
    
                    <div className="mb-6">
                        <label htmlFor="monto" className="block text-sm font-medium">Por Monto</label>
                        <input
                            type="number"
                            id="monto"
                            value={monto > 0 ? monto : ''}
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                setMonto(value);
                                setCantidad(0);
                            }}
                            className="mt-1 block w-full border border-transparent bg-indigo-900 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 p-3"
                        />
                    </div>
    
                    <div className="mb-6 flex justify-between">
                        <div>
                            <label htmlFor="precio" className="block text-sm font-medium">Precio por Acción</label>
                            <input
                                type="number"
                                id="precio"
                                value={precioCompra}
                                readOnly
                                className="mt-1 block w-full bg-transparent text-white text-lg font-semibold"
                            />
                        </div>
                        <div>
                            <label htmlFor="total" className="block text-sm font-medium">Total</label>
                            <input
                                type="number"
                                id="total"
                                value={cantidad > 0 ? total : monto}
                                readOnly
                                className="mt-1 block w-full bg-transparent text-white text-lg font-semibold"
                            />
                        </div>
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
                        }    

export default ComprarAccionesModal;
