import { useState, useEffect, useCallback } from 'react';

import type {
  NodeData,
  Node,
  ExpandedMap,
  AccessChildren,
  AccessId,
  SetFlatTree,
  Refresh,
} from '../../types';
import { flattenTree } from '../../utils';

interface UseFlaTreeStateArgs {
  tree: NodeData[];
  expandedMap: ExpandedMap;
  accessChildren: AccessChildren;
  accessId: AccessId;
}

interface UseFlaTreeStateReturn {
  flatTree: Node[];
  setFlatTree: SetFlatTree;
  refresh: Refresh;
}

export const useFlatTreeState = ({
  tree,
  expandedMap,
  accessChildren,
  accessId,
}: UseFlaTreeStateArgs): UseFlaTreeStateReturn => {
  const [flatTree, setFlatTree] = useState<Node[]>([]);

  useEffect(() => {
    if (flatTree.length === 0 && tree.length > 0) {
      setFlatTree(() => flattenTree({ tree, expandedMap, accessChildren, accessId }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tree]);

  const refresh: Refresh = useCallback(
    newTree =>
      setFlatTree(() =>
        flattenTree({ tree: newTree || tree, expandedMap, accessChildren, accessId })
      ),
    [tree, expandedMap, accessChildren, accessId, setFlatTree]
  );

  return {
    flatTree,
    setFlatTree,
    refresh,
  };
};
