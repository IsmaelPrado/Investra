import React, { useEffect, useState } from "react";
import { showToast } from "../../services/toastrService";
import {
  getPaymentMethods,
  PaymentMethod,
} from "../../services/paymentMethodService";
import BankTransfer from "./BankTransfer";
import CreditCard from "./CreditCard";
import Wallet from "./DigitalWallet";
import ConfirmationModal from "./ConfirmationModal";
import mxIcon from "../../assets/banks/mx.png"; // Import your currency icon
import LoadingModal from "./LoadingModal";
import { crearNuevaTransaccion } from "../../services/transactionService";
import { loginUserWithEmail } from "../../services/userService";

interface TransactionModalProps {
  userBalance: number;
  onClose: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  userBalance,
  onClose,
}) => {
  const [amount, setAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [accountInfo, setAccountInfo] = useState({
    bankName: "",
    accountNumber: "",
    clabeOrIban: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    porpose: "",
    walletAddress: "",
  });

  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false); // Estado para el modal de confirmación
  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false); // Estado para el modal de carga
  const [userId, setUserId] = useState<number | null>(null); // Estado para almacenar el user id
  const [userEmail, setUserEmail] = useState<string | null>(null); // Estado para almacenar el email

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const methods = await getPaymentMethods();
        setPaymentMethods(methods);
      } catch (error) {
        showToast("Error al cargar métodos de pago.", "error");
      }
    };

    fetchPaymentMethods();

    // Obtener el user id del localStorage
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setUserId(parsedUser.id); // Guardar el user id en el estado
      setUserEmail(parsedUser.correo); // Guardar el email en el estado
    }
  }, []);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
    const formattedValue = new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parseFloat(value) / 100); // Format as currency
    setAmount(value ? parseFloat(value) / 100 : 0); // Store as a number
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (amount < 0) {
      showToast("El monto debe ser positivo.", "error");
      return; // Mantiene el modal abierto
    }

    if (amount < 100) {
      showToast("El monto mínimo debe ser de $100.00 pesos mx", "warning");
      return; // Mantiene el modal abierto
    }

    // Mostrar el modal de confirmación
    setIsConfirmationModalOpen(true);
  };

  const handleConfirm = async () => {
    setIsConfirmationModalOpen(false);
    setIsLoadingModalOpen(true);

    if (userEmail) {
      try {
        localStorage.removeItem("user");

        const transactionDetails = {
          usuarioId: Number(userId),
          cantidad: amount,
          metodoPagoId: Number(paymentMethod),
          proposito: accountInfo.porpose,
        };

        const result = await crearNuevaTransaccion(transactionDetails);

        const loginResponse = await loginUserWithEmail(userEmail);
        localStorage.setItem("user", JSON.stringify(loginResponse.usuario));
 
        await new Promise((resolve) => setTimeout(resolve, 3000));
         // Mostrar el toast de éxito
    console.log("Resultado de la transacción: ", result);

        window.location.reload();
      } catch (error: any) {
        showToast("Error en el login, recargando la página...", "error");
        localStorage.removeItem("user");
        window.location.reload();
      } finally {
        setIsLoadingModalOpen(false);
      }
    }else{
        setIsLoadingModalOpen(false);
    }
  };

  const handleCancel = () => {
    setIsConfirmationModalOpen(false); // Cerrar el modal de confirmación
  };

  const renderPaymentMethodComponent = () => {
    switch (paymentMethod) {
      case "1": // Transferencia Bancaria
        return (
          <BankTransfer
            accountInfo={accountInfo}
            setAccountInfo={setAccountInfo}
          />
        );
      case "2": // Tarjeta de crédito / débito
        return (
          <CreditCard
            accountInfo={accountInfo}
            setAccountInfo={setAccountInfo}
          />
        );
      case "3": // Billetera Digital
        return (
          <Wallet accountInfo={accountInfo} setAccountInfo={setAccountInfo} />
        );
      default:
        return <p className="text-gray-400">Selecciona un método de pago.</p>;
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md text-white">
          <h2 className="text-2xl font-bold mb-4 text-gray-200">
            Realizar Transacción
          </h2>
          <p className="mb-4 text-gray-300">
            Saldo disponible: ${userBalance.toFixed(2)}
          </p>

          <form onSubmit={handleSubmit}>
            {/* Campo para el monto de la transacción */}
            <label htmlFor="paymentMethod" className="block text-gray-400 mb-2">
              Cantidad a depositar en tu cuenta Investra:
            </label>
            <div className="mb-4 flex items-center">
              <span className="material-icons -outlined mr-2">
                attach_money
              </span>
              <input
                type="text"
                value={
                  amount
                    ? new Intl.NumberFormat("es-MX", {
                        style: "currency",
                        currency: "MXN",
                      }).format(amount)
                    : "$0.00"
                }
                onChange={handleAmountChange}
                className="bg-gray-700 p-2 rounded w-full focus:outline-none text-white text-lg"
                placeholder="$0.00"
                required
              />
              <div className="flex flex-col items-center ml-2">
                <img src={mxIcon} alt="MX" className="w-6 h-6" />
                <span className="text-xs">MX</span>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="paymentMethod" className="block text-gray-400">
                Método de pago:
              </label>
              <select
                id="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring focus:ring-blue-500"
                required
              >
                <option value="">Seleccione un método</option>
                {paymentMethods.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.nombre_metodo}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">{renderPaymentMethodComponent()}</div>

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
              className={`w-full p-2 bg-blue-500 rounded text-white focus:outline-none ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Cargando..." : "Realizar Transacción"}
            </button>
          </form>

          <button
            onClick={onClose}
            className="mt-4 text-gray-400 hover:text-white"
          >
            Cerrar
          </button>
        </div>
      </div>

      {/* Modal de confirmación */}
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />

      {/* Modal de carga */}
      <LoadingModal isOpen={isLoadingModalOpen} />
    </>
  );
};

export default TransactionModal;
