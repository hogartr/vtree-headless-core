import { useEffect, useRef, useCallback } from 'react';

import type { NodeId, Node, IdToIndex } from '../../types';

interface UseIdToIndexArgs {
  flatTree: Node[];
}

export const useIdToIndex = ({ flatTree }: UseIdToIndexArgs): IdToIndex => {
  const idToIndexMap = useRef<Map<NodeId, number>>(new Map());

  useEffect(() => {
    idToIndexMap.current.clear();
    for (let i = 0; i < flatTree.length; i++) {
      idToIndexMap.current.set(flatTree[i].id, i);
    }
  }, [flatTree]);

  const idToIndex: IdToIndex = useCallback((id: NodeId) => idToIndexMap.current.get(id) ?? -1, []);
  return idToIndex;
};
