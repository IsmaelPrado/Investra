// src/components/ActionButtons.tsx
import React from "react";

interface ActionButtonsProps {
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void; 
  onClose: () => void;
  isSubmitDisabled: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isLoading,
  onSubmit,
  onClose,
  isSubmitDisabled,
}) => {
  return (
    <div className="flex justify-between mt-4">
      <button
        type="submit"
        disabled={isSubmitDisabled}
        onClick={onSubmit}
        className={`w-full p-2 bg-blue-500 rounded text-white focus:outline-none ${isSubmitDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isLoading ? "Cargando..." : "Realizar Transacción"}
      </button>
      <button
        onClick={onClose}
        className="mt-4 bg-red-500 p-2 rounded text-white ml-4"
      >
        Cerrar
      </button>
    </div>
  );
};

export default ActionButtons;
