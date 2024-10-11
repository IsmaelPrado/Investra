import React, { useState } from 'react';

interface CreditCardProps {
    accountInfo: {
        cardNumber: string;
        expiryDate: string;
        cvv: string;
        porpose: string;
    };
    setAccountInfo: React.Dispatch<React.SetStateAction<any>>;
}

const CreditCard: React.FC<CreditCardProps> = ({ accountInfo, setAccountInfo }) => {
    
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Función para formatear el número de tarjeta en grupos de 4
    const formatCardNumber = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || '';
        return formatted;
    };

    // Función para formatear la fecha de vencimiento
    const formatExpiryDate = (value: string) => {
        const cleaned = value.replace(/\D/g, ''); // Elimina todo lo que no sea un dígito
        const monthYear = cleaned.slice(0, 4); // Toma solo los primeros 4 dígitos
        if (monthYear.length > 2) {
            return `${monthYear.slice(0, 2)}/${monthYear.slice(2)}`; // Formato MM/AA
        }
        return monthYear; // Si no hay suficientes dígitos, devuelve lo que hay
    };

   // Función para formatear el número de CVV
const formatCVV = (value: string) => {
    const cleaned = value.replace(/\D/g, ''); // Elimina todo lo que no sea un dígito
    return cleaned.slice(0, 3); // Devuelve solo los primeros 3 dígitos
};

const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCVV(e.target.value);
    setAccountInfo({ ...accountInfo, cvv: formattedValue });
};


    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedValue = formatCardNumber(e.target.value);
        setAccountInfo({ ...accountInfo, cardNumber: formattedValue });
    };

    const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedValue = formatExpiryDate(e.target.value);
        setAccountInfo({ ...accountInfo, expiryDate: formattedValue });
    };

    const validateFields = () => {
        const newErrors: { [key: string]: string } = {};
        if (!accountInfo.cardNumber) {
            newErrors.cardNumber = 'El número de tarjeta es obligatorio.';
        }
        if (!accountInfo.expiryDate) {
            newErrors.expiryDate = 'La fecha de vencimiento es obligatoria.';
        }
        if (!accountInfo.cvv) {
            newErrors.cvv = 'El CVV es obligatorio.';
        }
        if (!accountInfo.porpose) {
            newErrors.porpose = 'El propósito del depósito es obligatorio.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Devuelve true si no hay errores
    };


    return (
        <>
            <div className="relative bg-gradient-to-r from-blue-800 to-green-900 rounded-lg p-6 shadow-lg text-white">
                {/* Simulación de una tarjeta de crédito */}
                <div className="mb-4 text-center">
                    <h3 className="text-lg font-bold">Tarjeta de Crédito / Débito</h3>
                </div>
                
                <div className="mb-6">
                    <label htmlFor="cardNumber" className="block text-sm">Número de Tarjeta</label>
                    <div className="bg-gray-900 p-2 rounded mt-2 flex items-center">
                        <input
                            type="text"
                            id="cardNumber"
                            value={accountInfo.cardNumber}
                            onChange={handleCardNumberChange}
                            className="bg-transparent text-lg w-full focus:outline-none text-white tracking-widest"
                            placeholder="0000 0000 0000 0000"
                            maxLength={19}
                            required
                        />
                         {errors.cardNumber && <p className="text-red-500 text-xs">{errors.cardNumber}</p>}
                        {/* Icono de tarjeta (opcional) */}
                        <span className="material-icons mr-2">credit_card</span>
                    </div>
                </div>

                <div className="flex justify-between mb-6">
                    <div className="w-1/2 pr-2">
                        <label htmlFor="expiryDate" className="block text-sm">Fecha de Vencimiento</label>
                        <input
                            type="text"
                            id="expiryDate"
                            value={accountInfo.expiryDate}
                            onChange={handleExpiryDateChange}
                            className="bg-gray-900 p-2 mt-2 rounded w-full focus:outline-none text-white text-lg"
                            placeholder="MM/AA"
                            maxLength={5} // Longitud máxima 5 (MM/AA)
                            required
                        />
                        {errors.expiryDate && <p className="text-red-500 text-xs">{errors.expiryDate}</p>}
                    </div>

                    <div className="w-1/2 pl-2">
                        <label htmlFor="cvv" className="block text-sm">CVV</label>
                        <input
                            type="text"
                            id="cvv"
                            value={accountInfo.cvv}
                            onChange={handleCVVChange}
                            className="bg-gray-900 p-2 mt-2 rounded w-full focus:outline-none text-white text-lg"
                            placeholder="123"
                            maxLength={3}
                            required
                        />
                          {errors.cvv && <p className="text-red-500 text-xs">{errors.cvv}</p>}
                    </div>
                </div>

                {/* Simulación del chip de la tarjeta */}
                <div className="absolute top-4 left-4">
                    <span className="material-icons mr-2">developer_board</span>
                </div>
            </div>

            <div className="mb-6 mt-6">
                <label htmlFor="depositPurpose" className=" block text-gray-400">Propósito del Depósito</label>
                <input
                    type="text"
                    id="depositPurpose"
                    value={accountInfo.porpose}
                    onChange={(e) => setAccountInfo({...accountInfo, porpose: e.target.value})}
                    className="bg-gray-900 p-2 mt-2 rounded w-full focus:outline-none text-white text-lg"
                    placeholder="Ej. Inversión en Investra"
                    required
                />
                {errors.porpose && <p className="text-red-500 text-xs">{errors.porpose}</p>}
            </div>
        </>
    );
};

export default CreditCard;
