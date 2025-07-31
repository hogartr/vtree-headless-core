import { useCallback } from 'react';

import * as check from '../../utils/validation';
import type { NodeData, NodeId } from '../../types';

export const useAccessId = (
  idAccessor: (node: NodeData) => unknown
): ((node: NodeData) => NodeId) => {
  const accessId = useCallback((node: NodeData): NodeId => {
    check.nodeExists(node);
    const id = idAccessor(node);
    if (typeof id !== 'string' && typeof id !== 'number') {
      throw new Error(`
        Node id's need to be of type string or number. 
        The provided node id is of type: ${typeof id}
      `);
    }
    return id;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return accessId;
};
