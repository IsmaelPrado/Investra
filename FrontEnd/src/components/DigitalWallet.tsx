// src/components/Wallet.tsx
import React from 'react';

const Wallet: React.FC = () => {
    return (
        <div className="mb-4">
            <label htmlFor="walletAddress" className="block text-gray-400">Dirección de Billetera:</label>
            <input
                type="text"
                id="walletAddress"
                className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring focus:ring-blue-500"
                required
            />
        </div>
    );
};

export default Wallet;
