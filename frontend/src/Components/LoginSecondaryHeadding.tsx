import React from 'react';

interface LoginSecondaryHeaddingProps {
  content: string;
}

function LoginSecondaryHeadding({ content }: LoginSecondaryHeaddingProps): React.JSX.Element {
  return (
    <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 text-center mb-6">
      {content}
    </p>
  );
}

export default LoginSecondaryHeadding;