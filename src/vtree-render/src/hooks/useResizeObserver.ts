import { useState, useEffect, useRef } from 'react';

interface UseResizeObserverReturn {
  ref: React.RefObject<HTMLDivElement | null>;
  width: number;
  height: number;
}

export const useResizeObserver = (): UseResizeObserverReturn => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        console.log(entry.contentRect.height);
        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    resizeObserver.observe(element);

    return (): void => {
      resizeObserver.disconnect();
    };
  }, []);

  return { ref, width: size.width, height: size.height };
};
