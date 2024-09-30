// src/components/CreditCard.tsx
import React from 'react';

interface CreditCardProps {
    accountInfo: {
        cardNumber: string;
        expiryDate: string;
        cvv: string;
    };
    setAccountInfo: React.Dispatch<React.SetStateAction<any>>;
}

const CreditCard: React.FC<CreditCardProps> = ({ accountInfo, setAccountInfo }) => {
    return (
        <>
            <div className="mb-4">
                <label htmlFor="cardNumber" className="block text-gray-400">Número de Tarjeta:</label>
                <input
                    type="text"
                    id="cardNumber"
                    value={accountInfo.cardNumber}
                    onChange={(e) => setAccountInfo({...accountInfo, cardNumber: e.target.value})}
                    className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring focus:ring-blue-500"
                    required
                />
            </div>

            <div className="mb-4">
                <label htmlFor="expiryDate" className="block text-gray-400">Fecha de Vencimiento:</label>
                <input
                    type="text"
                    id="expiryDate"
                    value={accountInfo.expiryDate}
                    onChange={(e) => setAccountInfo({...accountInfo, expiryDate: e.target.value})}
                    className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring focus:ring-blue-500"
                    placeholder="MM/AA"
                    required
                />
            </div>

            <div className="mb-4">
                <label htmlFor="cvv" className="block text-gray-400">Código de Seguridad (CVV):</label>
                <input
                    type="text"
                    id="cvv"
                    value={accountInfo.cvv}
                    onChange={(e) => setAccountInfo({...accountInfo, cvv: e.target.value})}
                    className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring focus:ring-blue-500"
                    required
                />
            </div>
        </>
    );
};

export default CreditCard;
