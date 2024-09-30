// src/components/TransactionModal.tsx
import React, { useState } from 'react';
import { showToast } from '../services/toastrService';
import BankTransfer from './BankTransfer';
import CreditCard from './CreditCard';
import Wallet from './DigitalWallet';

interface TransactionModalProps {
    userBalance: number;
    onClose: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ userBalance, onClose }) => {
    const [amount, setAmount] = useState<number>(0);
    const [paymentMethod, setPaymentMethod] = useState<string>('');
    const [accountInfo, setAccountInfo] = useState({
        bankName: '',
        accountNumber: '',
        clabeOrIban: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
    });
    const [authenticationCode, setAuthenticationCode] = useState<string>('');
    const [depositPurpose, setDepositPurpose] = useState<string>('');
    const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (amount + userBalance <= 0) {
                showToast('El monto debe ser positivo.', 'error');
                return;
            }

            // Lógica para realizar la transacción...

        } catch (error: any) {
            showToast(error.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md text-white">
                <h2 className="text-2xl font-bold mb-4 text-gray-200">Realizar Transacción</h2>
                <p className="mb-4 text-gray-300">Saldo disponible: ${userBalance.toFixed(2)}</p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="paymentMethod" className="block text-gray-400">Método de pago:</label>
                        <select
                            id="paymentMethod"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring focus:ring-blue-500"
                            required
                        >
                            <option value="">Seleccione un método</option>
                            <option value="transferencia">Transferencia Bancaria</option>
                            <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                            <option value="billetera">Billetera Digital</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="amount" className="block text-gray-400">Cantidad a depositar ($):</label>
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring focus:ring-blue-500"
                            required
                            min="1"
                        />
                    </div>

                    {paymentMethod === 'transferencia' && (
                        <BankTransfer accountInfo={accountInfo} setAccountInfo={setAccountInfo} />
                    )}

                    {paymentMethod === 'tarjeta' && (
                        <CreditCard accountInfo={accountInfo} setAccountInfo={setAccountInfo} />
                    )}

                    {paymentMethod === 'billetera' && <Wallet />}

                    <div className="mb-4">
                        <label htmlFor="authenticationCode" className="block text-gray-400">Código de autenticación:</label>
                        <input
                            type="text"
                            id="authenticationCode"
                            value={authenticationCode}
                            onChange={(e) => setAuthenticationCode(e.target.value)}
                            className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="depositPurpose" className="block text-gray-400">Propósito del depósito:</label>
                        <input
                            type="text"
                            id="depositPurpose"
                            value={depositPurpose}
                            onChange={(e) => setDepositPurpose(e.target.value)}
                            className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4 flex items-center">
                        <input
                            type="checkbox"
                            id="termsAccepted"
                            checked={termsAccepted}
                            onChange={() => setTermsAccepted(!termsAccepted)}
                            className="mr-2"
                        />
                        <label htmlFor="termsAccepted" className="text-gray-400">
                            Acepto los términos y condiciones
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={!termsAccepted || isLoading}
                        className={`w-full p-2 bg-blue-500 rounded text-white focus:outline-none ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? 'Cargando...' : 'Realizar Transacción'}
                    </button>
                </form>

                <button onClick={onClose} className="mt-4 text-gray-400 hover:text-white">Cerrar</button>
            </div>
        </div>
    );
};

export default TransactionModal;
