import React from 'react';

const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg data-testid="icon-arrow-left" width="16" height="16" viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default ArrowLeftIcon;