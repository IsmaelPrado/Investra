import React, { useEffect, useState } from 'react';
import { getTransferenciaBancoPorUsuario } from '../../services/paymentMethodService';
import { FaUniversity } from 'react-icons/fa';
import BBVALogo from '../../assets/banks/bbva.png';
import SantanderLogo from '../../assets/banks/santander.png';
import BanorteLogo from '../../assets/banks/banorte.png';
import HSBCLogo from '../../assets/banks/hsbc.png';
import CitibanamexLogo from '../../assets/banks/citibanamex.png';
import ScotiabankLogo from '../../assets/banks/scotiabank.png';
import BanamexLogo from '../../assets/banks/banamex.png';
import BancoAztecaLogo from '../../assets/banks/bancoazteca.png';

interface Transferencia {
    id: number;
    nombre_banco: string;
    numero_cuenta: string;
    clabe_o_iban: string;
    user_id: number;
}

interface BTPayMethodCardProps {
    userId: number;
    onTransferClick: (transferencia: Transferencia) => void; // Nueva prop para manejar el clic en la transferencia
}

const BTPayMethodCard: React.FC<BTPayMethodCardProps> = ({ userId, onTransferClick }) => {
    const [transferencias, setTransferencias] = useState<Transferencia[]>([]);
    const [transferenciaError, setTransferenciaError] = useState<string | null>(null);

    // Función para devolver el logo correcto según el nombre del banco
    const getBankLogo = (nombre_banco: string) => {
        switch (nombre_banco) {
            case 'BBVA':
                return BBVALogo;
            case 'Santander':
                return SantanderLogo;
            case 'Banorte':
                return BanorteLogo;
            case 'HSBC':
                return HSBCLogo;
            case 'Citibanamex':
            case 'banamex':
                return CitibanamexLogo;
            case 'Scotiabank':
                return ScotiabankLogo;
            case 'Banco Azteca':
                return BancoAztecaLogo;
            case 'Banamex':
                return BanamexLogo;
            default:
                return null;
        }
    };

    useEffect(() => {
        const fetchTransferencias = async () => {
            try {
                const transferencia = await getTransferenciaBancoPorUsuario(userId);

                if (Array.isArray(transferencia)) {
                    setTransferencias(transferencia);
                    setTransferenciaError(null);
                } else if (transferencia.message) {
                    setTransferenciaError(transferencia.message);
                }
            } catch (error) {
                console.error("Error al obtener transferencias bancarias:", error);
            }
        };

        fetchTransferencias();
    }, [userId]);

    return (
        <div className="p-4 bg-gray-900">
            {transferencias.length > 0 ? (
                <div>
                    <h4 className="font-semibold mb-4 text-white">Mis Transferencias Bancarias</h4>
                    <div className="overflow-x-auto">
                        <div className="flex space-x-4">
                            {transferencias.map((transferencia) => (
                                <div
                                    key={transferencia.id}
                                    className="flex-none w-1/2 bg-gray-800 shadow-xl rounded-lg p-6 hover:shadow-2xl transform hover:scale-105 transition-transform duration-300 cursor-pointer"
                                    onClick={() => onTransferClick(transferencia)}
                                    style={{ minWidth: '300px' }} // Aseguramos que cada transferencia tenga un ancho mínimo
                                >
                                     <div className="flex items-center mb-4">
                                        {getBankLogo(transferencia.nombre_banco) ? (
                                            <img
                                                src={getBankLogo(transferencia.nombre_banco) as string} // Aquí se asegura que sea una cadena
                                                alt={transferencia.nombre_banco}
                                                className="w-15 h-5 mr-4"
                                            />
                                        ) : (
                                            <FaUniversity className="text-blue-500 text-3xl mr-4" />
                                        )}
                                    </div>
                                    <p className="text-gray-400 text-sm">Banco: <span className="text-blue-400">{transferencia.nombre_banco}</span></p>
                                    <p className="text-gray-400 text-sm">Número de Cuenta: <span className="text-blue-400">{transferencia.numero_cuenta}</span></p>
                                    <p className="text-gray-400 text-sm">CLABE o IBAN: <span className="text-blue-400">{transferencia.clabe_o_iban}</span></p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </div>
    );
};

export default BTPayMethodCard;
