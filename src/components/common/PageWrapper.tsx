import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  return <div className="container mx-auto p-4">{children}</div>;
};

export default PageWrapper;
