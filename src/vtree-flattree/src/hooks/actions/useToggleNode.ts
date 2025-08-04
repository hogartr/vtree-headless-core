import { useCallback } from 'react';
import type { Node, NodeId, GetNodeById, ToggleNode } from '@vtree-headless/types';

import type { SetFlatTree, ExpandedMap, IdToIndex } from '../../types';
import { isValidNodeId, getVisibleChildren, insertAt, removeAt } from '../../utils';

interface UseToggleNodeArgs {
  getNodeById: GetNodeById;
  expandedMap: React.RefObject<ExpandedMap>;
  idToIndex: IdToIndex;
  setFlatTree: SetFlatTree;
}

export const useToggleNode = ({
  getNodeById,
  expandedMap,
  idToIndex,
  setFlatTree,
}: UseToggleNodeArgs): ToggleNode => {
  const toggleNode = useCallback(
    (arg: Node | NodeId) => {
      let tempNode = arg;
      if (isValidNodeId(arg)) {
        tempNode = getNodeById(arg as NodeId);
      }
      const node = tempNode as Node;

      if (expandedMap.current.has(node.id)) {
        expandedMap.current.delete(node.id);
        node.expanded = false;
      } else {
        expandedMap.current.set(node.id, true);
        node.expanded = true;
      }

      const index = idToIndex(node.id);
      const visibleChildren = getVisibleChildren(node, expandedMap.current);
      setFlatTree(prev => {
        if (node.expanded) {
          return insertAt(prev, index, visibleChildren);
        }
        return removeAt(prev, index, visibleChildren.length);
      });
    },
    [getNodeById, expandedMap, idToIndex, setFlatTree]
  );

  return toggleNode;
};
