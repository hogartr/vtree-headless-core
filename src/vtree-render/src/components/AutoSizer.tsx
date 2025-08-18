import React from 'react';

import { useResizeObserver } from '../hooks/useResizeObserver';
import mergeRefs from '../utils/mergeRefs';

interface AutoSizerProps {
  children: ({ width, height }: { width: number; height: number }) => React.ReactElement;
}

export const AutoSizer = React.forwardRef(function AutoSizer(
  { children }: AutoSizerProps,
  forwardRef
): React.ReactNode {
  const { ref, width, height } = useResizeObserver();

  return (
    <div ref={mergeRefs(ref, forwardRef)} style={{ width: '100%', height: '100%' }}>
      {children({ width, height })}
    </div>
  );
});
