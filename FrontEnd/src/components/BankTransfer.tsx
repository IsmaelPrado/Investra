// src/components/BankTransfer.tsx
import React from 'react';

interface BankTransferProps {
    accountInfo: {
        bankName: string;
        accountNumber: string;
        clabeOrIban: string;
    };
    setAccountInfo: React.Dispatch<React.SetStateAction<any>>;
}

const BankTransfer: React.FC<BankTransferProps> = ({ accountInfo, setAccountInfo }) => {
    return (
        <>
            <div className="mb-4">
                <label htmlFor="bankName" className="block text-gray-400">Nombre del Banco:</label>
                <input
                    type="text"
                    id="bankName"
                    value={accountInfo.bankName}
                    onChange={(e) => setAccountInfo({...accountInfo, bankName: e.target.value})}
                    className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring focus:ring-blue-500"
                    required
                />
            </div>

            <div className="mb-4">
                <label htmlFor="accountNumber" className="block text-gray-400">Número de Cuenta:</label>
                <input
                    type="text"
                    id="accountNumber"
                    value={accountInfo.accountNumber}
                    onChange={(e) => setAccountInfo({...accountInfo, accountNumber: e.target.value})}
                    className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring focus:ring-blue-500"
                    required
                />
            </div>

            <div className="mb-4">
                <label htmlFor="clabeOrIban" className="block text-gray-400">CLABE/IBAN:</label>
                <input
                    type="text"
                    id="clabeOrIban"
                    value={accountInfo.clabeOrIban}
                    onChange={(e) => setAccountInfo({...accountInfo, clabeOrIban: e.target.value})}
                    className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring focus:ring-blue-500"
                    required
                />
            </div>
        </>
    );
};

export default BankTransfer;
