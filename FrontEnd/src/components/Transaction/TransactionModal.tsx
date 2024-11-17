// src/components/TransactionModal.tsx
import React, { useEffect, useState } from "react";
import { showToast } from "../../services/toastrService";
import { crearBilleteraDigital, getPaymentMethods, PaymentMethod, crearTransferenciaBanco, crearTarjetaCredito } from "../../services/paymentMethodService";
import ConfirmationModal from "./ConfirmationModal";
import LoadingModal from "./LoadingModal";
import { crearNuevaTransaccion } from "../../services/transactionService";
import { loginUserWithEmail } from "../../services/userService";
import BTPayMethodCard from './BTPayMethodCard';
import DWPayMethodCard from "./DWPayMethodCard";


// Importar componentes nuevos
import AmountInput from "./AmountInput";
import PaymentMethodSelector from "./PaymentMethodSelector";
import TermsCheckbox from "./TermsCheckbox";
import ActionButtons from "./ActionButtons";
import BankTransfer from "./BankTransfer";
import CreditCard from "./CreditCard";
import Wallet from "./DigitalWallet";
import { useUser } from "../../context/UserContext";
import TCDPayMethodCard from "./TCDPayMethodCard";

interface TransactionModalProps {
  userBalance: number;
  onClose: () => void;
}

interface Transferencia {
  id: number;
  nombre_banco: string;
  numero_cuenta: string;
  clabe_o_iban: string;
  user_id: number;
}

interface Billetera {
  id: number;
  direccion_billetera: string;
  user_id: number;
}

interface Tarjeta {
  id: number;
  numero_tarjeta: string;
  fecha_vencimiento: number;
  cvv: number;
  nombre_titular: string;
  user_id: number;
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
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [selectedTransferencia, setSelectedTransferencia] = useState<Transferencia | null>(null); // New state for selected transfer
  const [selectedBilletera, setSelectedBilletera] = useState<Billetera | null>(null); // New state for selected transfer
  const [selectedTarjeta, setSelectedTarjeta] = useState<Tarjeta | null>(null);
  const { user } = useUser(); 

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

    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setUserId(parsedUser.id); // Store user ID
      setUserEmail(parsedUser.correo); // Store email
    }
  }, []);

  const handleAmountChange = (newAmount: number) => {
    setAmount(newAmount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (amount < 0) {
      showToast("El monto debe ser positivo.", "error");
      return;
    }

    if (amount < 100) {
      showToast("El monto mínimo debe ser de $100.00 pesos mx", "warning");
      return;
    }

    setIsConfirmationModalOpen(true);
  };

  const handleConfirm = async () => {
    setIsConfirmationModalOpen(false);
    setIsLoadingModalOpen(true);

    if (userEmail) {
      try {


        // Si el método de pago es 3 (Billetera Digital)
  
if (paymentMethod === "3") {
  if (!accountInfo.walletAddress) {
    showToast("Por favor, ingresa una dirección de billetera válida.", "warning");
    setIsLoadingModalOpen(false);
    return;
  }

  // Crear la billetera digital
  const billeteraData = {
    direccion_billetera: accountInfo.walletAddress,
    user_id: Number(userId),
  };

  console.log("Creando billetera digital con datos:", billeteraData);

  try {
    const billeteraResult = await crearBilleteraDigital(billeteraData);
    console.log("Resultado de la creación de la billetera:", billeteraResult);
    showToast("Billetera digital creada exitosamente.", "success");
  } catch (error: any) {
    console.error("Error al crear la billetera digital:", error);
  
    // Verificar si el error tiene una respuesta del servidor
    if (error.response && error.response.status === 400) {
      // Verificar si el mensaje de error es el de la cantidad máxima de billeteras
      if (error.response.data.message === "El usuario ya tiene la cantidad máxima de 5 billeteras digitales.") {
        showToast("El usuario ya tiene la cantidad máxima de 5 billeteras digitales. Para crear una nueva, elimine una billetera registrada.", "error");
      } else {
        showToast("Ocurrió un error al crear la billetera digital.", "error");
      }
    } else if (error instanceof Error) {
      // Manejar otros errores del tipo Error
      showToast("Ocurrió un error al crear la billetera digital.", "error");
    } else {
      // Si no es un error conocido, mostrar un mensaje genérico
      showToast("Ocurrió un error desconocido.", "error");
    }
    
    setIsLoadingModalOpen(false);
    return; // Salir de la función si hay un error
  }
  
      } else if (paymentMethod === '1'){
        if (!accountInfo.accountNumber || !accountInfo.bankName || !accountInfo.clabeOrIban) {
          showToast("Por favor, ingresa los datos válidos", "warning");
          setIsLoadingModalOpen(false);
          return;
        }

        // Crear la billetera digital
        const transferData = {
          nombre_banco: accountInfo.bankName,
          numero_cuenta: accountInfo.accountNumber,
          clabe_o_iban: accountInfo.clabeOrIban,
          user_id: Number(userId),
        };

        try {
          const transferResult = await crearTransferenciaBanco(transferData);
          console.log("Resultado de la creación de la transferencia bancaria:", transferResult);
          showToast("Transferencia bancaria creada exitosamente.", "success");
        } catch (error: any) {
          console.error("Error al crear la transferencia bancaria:", error);
        
          // Verificar si el error tiene una respuesta del servidor
          if (error.response && error.response.status === 400) {
            // Verificar si el mensaje de error es el de la cantidad máxima de billeteras
            if (error.response.data.message === "El usuario ya tiene la cantidad máxima de 5 transferencias bancarias.") {
              showToast("El usuario ya tiene la cantidad máxima de 5 transferencias bancarias. Para crear una nueva, elimine una transferencia registrada.", "error");
            } else {
              showToast("Ocurrió un error al crear la transferencia bancaria.", "error");
            }
          } else if (error instanceof Error) {
            // Manejar otros errores del tipo Error
            showToast("Ocurrió un error al crear la transferencia bancaria.", "error");
          } else {
            // Si no es un error conocido, mostrar un mensaje genérico
            showToast("Ocurrió un error desconocido.", "error");
          }
          
          setIsLoadingModalOpen(false);
          return; // Salir de la función si hay un error
        } 
      } else if(paymentMethod === '2'){
        if (!accountInfo.cardNumber || !accountInfo.cvv || !accountInfo.expiryDate) {
          showToast("Por favor, ingresa los datos válidos", "warning");
          setIsLoadingModalOpen(false);
          return;
        }

        // Crear la tarjeta
        const tarjetaData = {
          numero_tarjeta: accountInfo.cardNumber,
          fecha_vencimiento: accountInfo.expiryDate,
          cvv: accountInfo.cvv,
          nombre_titular: user?.nombre,
          user_id: Number(userId),
        };

        try {
          console.log(tarjetaData)
          const tarjetaResult = await crearTarjetaCredito(tarjetaData);
         
          console.log("Resultado de la creación de la transferencia bancaria:", tarjetaResult);
          showToast("Tarjeta creada exitosamente.", "success");
        } catch (error: any) {
          console.error("Error al crear la tarjeta:", error);
        
          // Verificar si el error tiene una respuesta del servidor
          if (error.response && error.response.status === 400) {
            // Verificar si el mensaje de error es el de la cantidad máxima de billeteras
            if (error.response.data.message === "El usuario ya tiene la cantidad máxima de 5 tarjetas.") {
              showToast("El usuario ya tiene la cantidad máxima de 5 tarjetas. Para crear una nueva, elimine una tarjeta registrada.", "error");
            } else {
              showToast("Ocurrió un error al crear la tarjeta.", "error");
            }
          } else if (error instanceof Error) {
            // Manejar otros errores del tipo Error
            showToast("Ocurrió un error al crear la tarjeta.", "error");
          } else {
            // Si no es un error conocido, mostrar un mensaje genérico
            showToast("Ocurrió un error desconocido.", "error");
          }
          
          setIsLoadingModalOpen(false);
          return; // Salir de la función si hay un error
        }
      }
      
        const transactionDetails = {
          usuarioId: Number(userId),
          cantidad: amount,
          metodoPagoId: Number(paymentMethod),
          proposito: accountInfo.porpose,
        };

        const result = await crearNuevaTransaccion(transactionDetails);
        localStorage.removeItem("user");
        const loginResponse = await loginUserWithEmail(userEmail);
        localStorage.setItem("user", JSON.stringify(loginResponse.usuario));
 
        await new Promise((resolve) => setTimeout(resolve, 3000));

        console.log("Resultado de la transacción: ", result);
       window.location.reload();
      } catch (error: any) {
        showToast("Error en el login, recargando la página...", "error");
        localStorage.removeItem("user");
        window.location.reload();
      } finally {
        setIsLoadingModalOpen(false);
      }
    } else {
        setIsLoadingModalOpen(false);
    }
  };

  const handleCancel = () => {
    setIsConfirmationModalOpen(false); 
  };

  const renderPaymentMethodComponent = () => {
    switch (paymentMethod) {
      case "1":
        return <BankTransfer accountInfo={accountInfo} setAccountInfo={setAccountInfo} />;
      case "2":
        return <CreditCard accountInfo={accountInfo} setAccountInfo={setAccountInfo} />;
      case "3":
        return <Wallet accountInfo={accountInfo} setAccountInfo={setAccountInfo} />;
      default:
        return <p className="text-gray-400">Selecciona un nuevo método de pago.</p>;
    }
  };

  // Manejar el clic en una billetera
  const handleWalletClick = async (billetera: Billetera) => {
       // Validar que el monto sea mayor o igual a 100
       if (amount < 100) {
        showToast("El monto debe ser de al menos $100.00.", "warning");
        return; // Salir si no cumple la condición
      }
      
    console.log("Billetera seleccionada:", billetera);
    setSelectedBilletera(billetera); // Save selected transfer
    setIsConfirmationModalOpen(true); // Open confirmation modal
  };

  const handleConfirmWallet = async () => {
    setIsLoadingModalOpen(true);
    if (userEmail && selectedBilletera) {
        try {
            // Asegúrate de que paymentMethod sea un ID válido
            const validPaymentMethodId = 3
            
            localStorage.removeItem("user");
            const transactionDetails = {
                usuarioId: Number(selectedBilletera.user_id),
                cantidad: amount,
                metodoPagoId: validPaymentMethodId,
                proposito: accountInfo.porpose || "Sin propósito",
            };
  
            console.log("Detalles de la transacción:", transactionDetails);
  
            // Crear una nueva transacción
            const result = await crearNuevaTransaccion(transactionDetails);
            console.log("Resultado de la transacción: ", result);
  
            const loginResponse = await loginUserWithEmail(userEmail);
            localStorage.setItem("user", JSON.stringify(loginResponse.usuario));
            // Simular un delay de 3 segundos antes de continuar
            await new Promise((resolve) => setTimeout(resolve, 3000));
            window.location.reload();
        } catch (error: any) {
            showToast("Error en la transacción, recargando la página...", "error");
            localStorage.removeItem("user");
           window.location.reload();
        } finally {
            setIsLoadingModalOpen(false);
        }
    } else {
        setIsLoadingModalOpen(false);
    }
  };
  



 // Manejar el clic en una tarjeta
 const handleCardClick = async (tarjeta: Tarjeta) => {
  // Validar que el monto sea mayor o igual a 100
  if (amount < 100) {
    showToast("El monto debe ser de al menos $100.00.", "warning");
    return; // Salir si no cumple la condición
  }
  
console.log("Tarjeta seleccionada:", tarjeta);
setSelectedTarjeta(tarjeta); // Save selected transfer
setIsConfirmationModalOpen(true); // Open confirmation modal
};

const handleConfirmTarjeta = async () => {
  setIsLoadingModalOpen(true);
  if (userEmail && selectedTarjeta) {
      try {
          // Asegúrate de que paymentMethod sea un ID válido
          const validPaymentMethodId = 2
          
          localStorage.removeItem("user");
          const transactionDetails = {
              usuarioId: Number(selectedTarjeta.user_id),
              cantidad: amount,
              metodoPagoId: validPaymentMethodId,
              proposito: accountInfo.porpose || "Sin propósito",
          };

          console.log("Detalles de la transacción:", transactionDetails);

          // Crear una nueva transacción
          const result = await crearNuevaTransaccion(transactionDetails);
          console.log("Resultado de la transacción: ", result);

          const loginResponse = await loginUserWithEmail(userEmail);
          localStorage.setItem("user", JSON.stringify(loginResponse.usuario));
          // Simular un delay de 3 segundos antes de continuar
          await new Promise((resolve) => setTimeout(resolve, 3000));
          window.location.reload();
      } catch (error: any) {
          showToast("Error en la transacción, recargando la página...", "error");
          localStorage.removeItem("user");
         window.location.reload();
      } finally {
          setIsLoadingModalOpen(false);
      }
  } else {
      setIsLoadingModalOpen(false);
  }
};

  
 // Manejar el clic en una transferencia
 const handleTransferClick = async (transferencia: Transferencia) => {
  // Validar que el monto sea mayor o igual a 100
  if (amount < 100) {
    showToast("El monto debe ser de al menos $100.00.", "warning");
    return; // Salir si no cumple la condición
  }
  
console.log("Transferencia seleccionada:", transferencia);
setSelectedTransferencia(transferencia); // Save selected transfer
setIsConfirmationModalOpen(true); // Open confirmation modal
};

const handleConfirmTransfer = async () => {
setIsLoadingModalOpen(true);
if (userEmail && selectedTransferencia) {
    try {
        // Asegúrate de que paymentMethod sea un ID válido
        const validPaymentMethodId = 1
        
        localStorage.removeItem("user");
        const transactionDetails = {
            usuarioId: Number(selectedTransferencia.user_id),
            cantidad: amount,
            metodoPagoId: validPaymentMethodId,
            proposito: accountInfo.porpose || "Sin propósito",
        };

        console.log("Detalles de la transacción:", transactionDetails);

        // Crear una nueva transacción
        const result = await crearNuevaTransaccion(transactionDetails);
        console.log("Resultado de la transacción: ", result);

        const loginResponse = await loginUserWithEmail(userEmail);
        localStorage.setItem("user", JSON.stringify(loginResponse.usuario));
        // Simular un delay de 3 segundos antes de continuar
        await new Promise((resolve) => setTimeout(resolve, 3000));
        window.location.reload();
    } catch (error: any) {
        showToast("Error en la transacción, recargando la página...", "error");
        localStorage.removeItem("user");
       window.location.reload();
    } finally {
        setIsLoadingModalOpen(false);
    }
} else {
    setIsLoadingModalOpen(false);
}
};


  return (
    <>
      <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50 max-h-[60vh] overflow-y-auto">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-3xl text-white">
          <h2 className="text-2xl font-bold mb-4 text-gray-200">Meter Fondos</h2>
          <p className="mb-4 text-gray-300">Fondo disponible: ${userBalance.toFixed(2)}</p>
          
          {/* Contenedor con scroll */}
          <div className="max-h-[60vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              {/* Componente de entrada de monto */}
              <AmountInput amount={amount} onAmountChange={handleAmountChange} text={'Cantidad a Depositar:'}/>

              {/* Componentes de métodos de pago */}
              {userId && <DWPayMethodCard userId={userId} onWalletClick={handleWalletClick} />}
              {userId && <BTPayMethodCard userId={userId} onTransferClick={handleTransferClick} />}
              {userId && <TCDPayMethodCard userId={userId} onCardClick={handleCardClick} />}

              {/* Componente selector de método de pago */}
              <PaymentMethodSelector
                paymentMethod={paymentMethod}
                paymentMethods={paymentMethods}
                onPaymentMethodChange={setPaymentMethod}
              />

              {/* Renderizar componente de método de pago seleccionado */}
              <div className="mb-4">{renderPaymentMethodComponent()}</div>

              {/* Componente de checkbox de términos */}
              <TermsCheckbox
                termsAccepted={termsAccepted}
                onToggle={() => setTermsAccepted(!termsAccepted)}
              />

              {/* Componentes de botones de acción */}
              <ActionButtons
                isLoading={isLoading}
                onSubmit={handleSubmit}
                onClose={onClose}
                isSubmitDisabled={!termsAccepted || isLoading}
              />
            </form>
          </div>
        </div>
      </div>

      <ConfirmationModal
    isOpen={isConfirmationModalOpen}
    onConfirm={selectedTarjeta ? handleConfirmTarjeta : selectedTransferencia ? handleConfirmTransfer : selectedBilletera ? handleConfirmWallet : handleConfirm}
    onCancel={handleCancel}
    text={"¿Estás seguro de que deseas realizar un depósito desde el método de pago seleccionado?"}
/>

      <LoadingModal isOpen={isLoadingModalOpen} />
    </>
  );
};

export default TransactionModal;

