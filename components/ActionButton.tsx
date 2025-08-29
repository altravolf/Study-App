
import React from 'react';

interface ActionButtonProps {
  label: string;
  amount: number;
  onClick: (amount: number, description: string) => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ label, amount, onClick }) => {
  const isPositive = amount > 0;
  const buttonClasses = isPositive
    ? 'bg-green-600 hover:bg-green-700'
    : 'bg-red-600 hover:bg-red-700';

  return (
    <button
      onClick={() => onClick(amount, label)}
      className={`w-full p-3 rounded-lg text-white font-semibold transition-colors duration-200 shadow-md ${buttonClasses}`}
    >
      <p className="text-sm">{label}</p>
      <p className="text-lg">{isPositive ? `+${amount}` : amount}</p>
    </button>
  );
};

export default ActionButton;
