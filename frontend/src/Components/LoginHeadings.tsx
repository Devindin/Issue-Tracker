import React from 'react';

interface LoginHeadingsProps {
  content: string;
}

function LoginHeadings({ content }: LoginHeadingsProps): React.JSX.Element {
  return (
    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#0A3D91] dark:text-white text-center mb-2">
      {content}
    </h1>
  );
}

export default LoginHeadings;