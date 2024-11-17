// src/components/AmountInput.tsx
import React from "react";
import mxIcon from "../../assets/banks/mx.png";

interface AmountInputProps {
  amount: number;
  onAmountChange: (amount: number) => void;
  text: String;
}

const AmountInput: React.FC<AmountInputProps> = ({ amount, onAmountChange, text }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    const numericValue = value ? parseFloat(value) / 100 : 0;
    onAmountChange(numericValue);
  };

  return (
    <div className="mb-4">
      <label htmlFor="amount" className="block text-gray-400 mb-2">
        {text}
      </label>
      <div className="mb-4 flex items-center">
        <span className="material-icons -outlined mr-2">attach_money</span>
        <input
          type="text"
          id="amount"
          value={
            amount
              ? new Intl.NumberFormat("es-MX", {
                  style: "currency",
                  currency: "MXN",
                }).format(amount)
              : "$0.00"
          }
          onChange={handleChange}
          className="bg-gray-700 p-2 rounded w-full focus:outline-none text-white text-lg"
          placeholder="$0.00"
          required
        />
        <div className="flex flex-col items-center ml-2">
          <img src={mxIcon} alt="MX" className="w-6 h-6" />
          <span className="text-xs">MX</span>
        </div>
      </div>
    </div>
  );
};

export default AmountInput;
