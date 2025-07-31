import { useCallback } from 'react';

import * as check from '../../utils/validation';
import type { NodeData, AccessChildren, AccessChildrenReturn, ChildrenAccessor } from '../../types';

export const useAccessChildren = (childrenAccessor: ChildrenAccessor): AccessChildren => {
  const accessChildren = useCallback((node: NodeData): AccessChildrenReturn => {
    check.nodeExists(node);
    const children = childrenAccessor(node);
    if (!Array.isArray(children)) {
      return null;
    }
    return children;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return accessChildren;
};
