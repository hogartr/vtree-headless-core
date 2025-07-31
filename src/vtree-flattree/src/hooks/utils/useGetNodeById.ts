import { useCallback } from 'react';

import type { NodeId, Node, IdToIndex, GetNodeById } from '../../types';

interface UseGetNodeById {
  flatTree: Node[];
  idToIndex: IdToIndex;
}

export const useGetNodeById = ({ flatTree, idToIndex }: UseGetNodeById): GetNodeById => {
  const getNodeById: GetNodeById = useCallback(
    (id: NodeId): Node => {
      const index = idToIndex(id);
      return flatTree[index];
    },
    [flatTree, idToIndex]
  );

  return getNodeById;
};
