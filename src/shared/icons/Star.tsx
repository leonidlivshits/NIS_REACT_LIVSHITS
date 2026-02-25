import React from 'react';

const StarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg data-testid="icon-star" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
    <path
      d="M12 17.3l6.18 3.73-1.64-7.03L21 9.24l-7.19-.62L12 2 10.19 8.62 3 9.24l4.46 4.76L5.82 21z"
      stroke="currentColor"
      strokeWidth="0.5"
      strokeLinejoin="round"
      fill="currentColor"
    />
  </svg>
);

export default StarIcon;