// src/components/Wallet.tsx
import React from 'react';

interface WalletProps {
    accountInfo: {
        walletAddress: string;
        porpose: string;
    };
    setAccountInfo: React.Dispatch<React.SetStateAction<any>>;
}

const Wallet: React.FC<WalletProps> = ({ accountInfo, setAccountInfo }) => {
    return (
        <>
        <div className="p-4 bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2 text-gray-200">Billetera Digital</h3>
            <div className="border border-gray-600 rounded-lg p-4 mb-4">
                <label htmlFor="walletAddress" className="block text-gray-400 mb-1">Dirección de Billetera:</label>
                <input
                    type="text"
                    id="walletAddress"
                    value={accountInfo.walletAddress}
                    onChange={(e) => setAccountInfo({ ...accountInfo, walletAddress: e.target.value })}
                    className="block w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring focus:ring-blue-500"
                    required
                />
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
            </div>

</>
    );
};

export default Wallet;
