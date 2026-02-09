interface PrimaryButtonProps {
  label: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
}

function PrimaryButton({ label, type = "button", onClick, disabled = false }: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full lg:h-[50px] h-[44px] bg-gradient-to-r from-[#0A3D91] to-[#00C6D7] hover:from-[#1976D2] hover:to-[#1976D2] text-white rounded-[12px] mt-[10px] xl:text-[19px] 3xl:text-[22px] sm:text-[16px] text-[14px] font-normal md:font-medium font-roboto transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#00C6D7]/25 transform hover:scale-[1.02] ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {label}
    </button>
  );
}

export default PrimaryButton;