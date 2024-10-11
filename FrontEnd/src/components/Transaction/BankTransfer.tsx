// src/components/BankTransfer.tsx
import React, { useState } from 'react';
import BBVALogo from '../../assets/banks/bbva.png'; // Cambia a importación por defecto para PNG
import SantanderLogo from '../../assets/banks/santander.png';
import BanorteLogo from '../../assets/banks/banorte.png';
import HSBCLogo from '../../assets/banks/hsbc.png';
import CitibanamexLogo from '../../assets/banks/citibanamex.png';
import ScotiabankLogo from '../../assets/banks/scotiabank.png';
import BanamexLogo from '../../assets/banks/banamex.png';
import BancoAztecaLogo from '../../assets/banks/bancoazteca.png';

interface BankTransferProps {
    accountInfo: {
        bankName: string;
        accountNumber: string;
        clabeOrIban: string;
        porpose: string;
    };
    setAccountInfo: React.Dispatch<React.SetStateAction<any>>;
}

const banks = [
    { value: '', label: 'Selecciona un banco', icon: null },
    { value: 'BBVA', label: 'BBVA', icon: BBVALogo },
    { value: 'Santander', label: 'Santander', icon: SantanderLogo },
    { value: 'Banorte', label: 'Banorte', icon: BanorteLogo },
    { value: 'HSBC', label: 'HSBC', icon: HSBCLogo },
    { value: 'Citibanamex', label: 'Citibanamex', icon: CitibanamexLogo },
    { value: 'Scotiabank', label: 'Scotiabank', icon: ScotiabankLogo },
    { value: 'Banamex', label: 'Banamex', icon: BanamexLogo },
    { value: 'Banco Azteca', label: 'Banco Azteca', icon: BancoAztecaLogo }
];

const BankTransfer: React.FC<BankTransferProps> = ({ accountInfo, setAccountInfo }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedBank, setSelectedBank] = useState(banks[0]);
    const [accountNumberError, setAccountNumberError] = useState('');
    const [clabeOrIbanError, setClabeOrIbanError] = useState('');

    const handleBankSelect = (bank: typeof banks[number]) => {
        setAccountInfo({ ...accountInfo, bankName: bank.value });
        setSelectedBank(bank);
        setIsOpen(false);
    };

    const validateAccountNumber = (value: string) => {
        const isValid = /^\d{10,18}$/.test(value);
        setAccountNumberError(isValid ? '' : 'Número de cuenta debe contener de 10 a 18 dígitos.');
        return isValid;
    };

    const validateClabeOrIban = (value: string) => {
        const isValid = /^\d{18}$/.test(value); // CLABE debe ser de 18 dígitos
        setClabeOrIbanError(isValid ? '' : 'La CLABE/IBAN debe ser de 18 dígitos y contener solo números.');
        return isValid;
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Permitir solo números
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-200 mb-6">Transferencia Bancaria</h3>

            <div className="mb-4">
                <label htmlFor="bankName" className="block text-gray-400 text-sm mb-2">Nombre del Banco</label>
                <div className="relative">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="block w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    >
                        <div className="flex items-center">
                            {selectedBank.icon && <img src={selectedBank.icon} alt={selectedBank.label} className="mr-2 h-5 w-15" />}
                            <span>{selectedBank.label}</span>
                        </div>
                        <span className="text-gray-400">▼</span>
                    </button>
                    {isOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-gray-900 border border-gray-600 rounded-lg shadow-lg">
                            {banks.map((bank) => (
                                <div
                                    key={bank.value}
                                    onClick={() => handleBankSelect(bank)}
                                    className="flex items-center p-3 cursor-pointer hover:bg-gray-600 transition-all"
                                >
                                    {bank.icon && <img src={bank.icon} alt={bank.label} className="mr-2 h-5 w-15" />}
                                    <span>{bank.label}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="mb-4">
                <label htmlFor="accountNumber" className="block text-gray-400 text-sm mb-2">Número de Cuenta</label>
                <input
                    type="text"
                    id="accountNumber"
                    value={accountInfo.accountNumber}
                    onChange={(e) => {
                        const value = e.target.value;
                        setAccountInfo({ ...accountInfo, accountNumber: value });
                        validateAccountNumber(value);
                    }}
                    onKeyPress={handleKeyPress} // Restringir entrada a solo números
                    className={`block w-full p-3 ${accountNumberError ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                    placeholder="Introduce tu número de cuenta"
                    required
                />
                {accountNumberError && <p className="text-red-500 text-sm mt-1">{accountNumberError}</p>}
            </div>

            <div className="mb-4">
                <label htmlFor="clabeOrIban" className="block text-gray-400 text-sm mb-2">CLABE/IBAN</label>
                <input
                    type="text"
                    id="clabeOrIban"
                    value={accountInfo.clabeOrIban}
                    onChange={(e) => {
                        const value = e.target.value;
                        setAccountInfo({ ...accountInfo, clabeOrIban: value });
                        validateClabeOrIban(value);
                    }}
                    onKeyPress={handleKeyPress} // Restringir entrada a solo números
                    className={`block w-full p-3 ${clabeOrIbanError ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                    placeholder="Introduce tu CLABE o IBAN"
                    required
                />
                {clabeOrIbanError && <p className="text-red-500 text-sm mt-1">{clabeOrIbanError}</p>}
            </div>

            <div className="mb-6 mt-6">
                <label htmlFor="depositPurpose" className="block text-gray-400">Propósito del Depósito</label>
                <input
                    type="text"
                    id="depositPurpose"
                    value={accountInfo.porpose}
                    onChange={(e) => setAccountInfo({ ...accountInfo, porpose: e.target.value })}
                    className="bg-gray-900 p-2 mt-2 rounded w-full focus:outline-none text-white text-lg"
                    placeholder="Ej. Inversión en Investra"
                    required
                />
            </div>
        </div>
    );
};

export default BankTransfer;
