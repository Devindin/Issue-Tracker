import React from "react";

interface PageTitleProps {
  title: string;
  subtitle?: string;
  textColor?: string;
  align?: "left" | "center" | "right";
}

const PageTitle: React.FC<PageTitleProps> = ({
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
          text-2xl sm:text-3xl md:text-4xl lg:text-5xl
          leading-tight
          break-words
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
          `}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default PageTitle;
