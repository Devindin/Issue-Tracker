import React from "react";

interface PageTitleProps {
  title: string;
  subtitle?: string;
  textColor?: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title, subtitle, textColor = "text-white" }) => {
  return (
    <div>
      <h1 className={`text-3xl md:text-4xl font-bold ${textColor}`}>
        {title}
      </h1>
      {subtitle && (
        <p className={`mt-1 ${textColor}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default PageTitle;