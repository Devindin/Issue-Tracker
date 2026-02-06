interface PrimaryButtonProps {
  label: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

function PrimaryButton({ label, type = "button", onClick }: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full lg:h-[50px] h-[44px] bg-[#0A3D91] hover:bg-[#1976D2] text-white rounded-[12px] mt-[10px] xl:text-[19px] 3xl:text-[22px] sm:text-[16px] text-[14px] font-normal md:font-medium font-roboto transition-colors duration-200 shadow-lg hover:shadow-xl"
    >
      {label}
    </button>
  );
}

export default PrimaryButton;