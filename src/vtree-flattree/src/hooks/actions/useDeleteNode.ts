import { useCallback } from 'react';
import type {
  Node,
  NodeId,
  GetNodeById,
  DeleteNode,
  NodeData,
  Refresh,
} from '@vtree-headless/types';

import type { ExpandedMap, IdToIndex } from '../../types';
import { isValidNodeId } from '../../utils';
import type { AccessChildren } from '../../types/accessors';
import { ROOT_NODE_ID } from '../../variables/kinds';

interface UseDeleteNodeArgs {
  getNodeById: GetNodeById;
  expandedMap: React.RefObject<ExpandedMap>;
  idToIndex: IdToIndex;
  accessChildren: AccessChildren;
  setFn: React.Dispatch<React.SetStateAction<NodeData[]>> | undefined;
  refresh: Refresh;
}

export const useDeleteNode = ({
  getNodeById,
  expandedMap,
  idToIndex,
  accessChildren,
  setFn,
  refresh,
}: UseDeleteNodeArgs): DeleteNode => {
  const deleteNode = useCallback(
    (arg: Node | NodeId) => {
      let tempNode = arg;
      if (isValidNodeId(arg)) {
        tempNode = getNodeById(arg as NodeId);
      }
      const node = tempNode as Node;

      if (node.parent?.id === null) {
        console.warn('Cannot delete internal root node');
        return;
      }

      setFn?.(prev => {
        const updateNodes = [...prev];
        let siblings: NodeData[] = [];
        if (node.parent?.id === ROOT_NODE_ID) {
          siblings = updateNodes;
        } else {
          siblings = accessChildren(node.parent?.data || {}) as NodeData[];
        }
        if (!siblings) {
          console.warn('No siblings found for the node');
          return updateNodes;
        }
        for (let i = 0; i < (siblings.length || 0); i++) {
          if (siblings[i].id === node.id) {
            siblings.splice(i, 1);
            break;
          }
        }
        refresh(updateNodes);

        return updateNodes;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getNodeById, expandedMap, idToIndex, setFn, refresh]
  );

  return deleteNode;
};
