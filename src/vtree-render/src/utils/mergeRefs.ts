import React from 'react';
import type { T } from '@vtree-headless/types';

type AnyRef = React.RefObject<T> | React.RefCallback<T> | null;

export default function mergeRefs(...refs: AnyRef[]) {
  return (instance: T): void => {
    refs.forEach(ref => {
      if (typeof ref === 'function') {
        ref(instance);
      } else if (ref != null) {
        ref.current = instance;
      }
    });
  };
}
