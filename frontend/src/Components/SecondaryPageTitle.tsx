import React from "react";

interface PageTitleProps {
  title: string;
  subtitle?: string;
  textColor?: string;
  align?: "left" | "center" | "right";
}

const SecondaryPageTitle: React.FC<PageTitleProps> = ({
  title,
  subtitle,
  textColor = "text-white",
  align = "left",
}) => {
  const alignment =
    align === "center"
      ? "text-center"
      : align === "right"
      ? "text-right"
      : "text-left";

  return (
    <div className={`w-full ${alignment}`}>
      <h1
        className={`
          ${textColor}
          font-bold
          text-lg sm:text-lg md:text-2xl lg:text-2xl 
          leading-tight
          break-words
          ml-16 md:ml-0
        `}
      >
        {title}
      </h1>

      {subtitle && (
        <p
          className={`
            ${textColor}
            mt-1 sm:mt-2
            text-sm sm:text-base md:text-lg
            opacity-80
            break-words
            ml-16 md:ml-0
          `}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SecondaryPageTitle;
