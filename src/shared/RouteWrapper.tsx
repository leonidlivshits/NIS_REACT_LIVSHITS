import React, { Suspense } from 'react';
import ErrorBoundary from './ErrorBoundary';

type Props = {
  children: React.ReactElement;
};

export const RouteWrapper: React.FC<Props> = ({ children }) => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div style={{ padding: 20 }}>Loading page…</div>}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

export default RouteWrapper;
