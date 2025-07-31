import type React from 'react';

import { useResizeObserver } from '../hooks/useResizeObserver';

export const AutoSizer = ({
  children,
}: {
  children: ({ width, height }: { width: number; height: number }) => React.JSX.Element;
}) => {
  const { ref, width, height } = useResizeObserver();

  return (
    <div ref={ref} style={{ width: '100%', height: '100%' }}>
      {children({ width, height })}
    </div>
  );
};
