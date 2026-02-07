import React from "react";

interface PageTitleProps {
  title: string;
  subtitle: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title, subtitle }) => {
  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-bold text-white">
        {title}
      </h1>
      <p className="text-white mt-1">
        {subtitle}
      </p>
    </div>
  );
};

export default PageTitle;