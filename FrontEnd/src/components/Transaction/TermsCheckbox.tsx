// src/components/TermsCheckbox.tsx
import React from "react";

interface TermsCheckboxProps {
  termsAccepted: boolean;
  onToggle: () => void;
}

const TermsCheckbox: React.FC<TermsCheckboxProps> = ({ termsAccepted, onToggle }) => {
  return (
    <div className="mb-4 flex items-center">
      <input
        type="checkbox"
        id="termsAccepted"
        checked={termsAccepted}
        onChange={onToggle}
        className="mr-2"
      />
      <label htmlFor="termsAccepted" className="text-gray-400">
        Acepto los términos y condiciones
      </label>
    </div>
  );
};

export default TermsCheckbox;
