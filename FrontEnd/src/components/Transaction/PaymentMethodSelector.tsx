// src/components/PaymentMethodSelector.tsx
import React from "react";
import { PaymentMethod } from "../../services/paymentMethodService";

interface PaymentMethodSelectorProps {
  paymentMethod: string;
  paymentMethods: PaymentMethod[];
  onPaymentMethodChange: (methodId: string) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  paymentMethod,
  paymentMethods,
  onPaymentMethodChange,
}) => {
  return (
    <div className="mb-4">
      <label htmlFor="paymentMethod" className="block text-gray-400">
        Método de pago:
      </label>
      <select
        id="paymentMethod"
        value={paymentMethod}
        onChange={(e) => onPaymentMethodChange(e.target.value)}
        className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring focus:ring-blue-500"
        required
      >
        <option value="">Seleccione un nuevo método</option>
        {paymentMethods.map((method) => (
          <option key={method.id} value={method.id}>
            {method.nombre_metodo}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PaymentMethodSelector;
