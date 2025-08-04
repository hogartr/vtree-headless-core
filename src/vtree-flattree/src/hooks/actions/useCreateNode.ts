import { useCallback } from 'react';
import type {
  Node,
  NodeId,
  GetNodeById,
  CreateNode,
  NodeData,
  SetChildren,
  Refresh,
} from '@vtree-headless/types';

import type { ExpandedMap, AccessChildren, IdToIndex } from '../../types';
import { isValidNodeId } from '../../utils';

interface UseCreateNodeArgs {
  getNodeById: GetNodeById;
  setFn: React.Dispatch<React.SetStateAction<NodeData[]>> | undefined;
  accessChildren: AccessChildren;
  setChildren: SetChildren | undefined;
  expandedMap: ExpandedMap;
  idToIndex: IdToIndex;
  refresh: Refresh;
}

export const useCreateNode = ({
  getNodeById,
  setFn,
  accessChildren,
  setChildren,
  expandedMap,
  idToIndex,
  refresh,
}: UseCreateNodeArgs): CreateNode => {
  // accessChildren and accessId are intentionally omitted from the dependency array
  // because they are not stable and only their initial definitions are needed.
  const createNode: CreateNode = useCallback(
    (newNode, parent, position) => {
      let tempParent = parent;
      if (isValidNodeId(parent)) {
        tempParent = getNodeById(parent as NodeId);
      }
      const parentNode = tempParent as Node;

      if (!parentNode) {
        throw new Error(
          `Could not resolve a valid parent node. Received: ${JSON.stringify(parent)}`
        );
      }

      if (!newNode) {
        throw new Error(
          `Cannot create a node: the provided newNode argument is missing or invalid. Received: ${JSON.stringify(newNode)}`
        );
      }

      const siblings: NodeData[] = [...(accessChildren(parentNode.data) || [])];

      switch (position) {
        case 'start':
          siblings.unshift(newNode);
          break;
        case 'end':
          siblings.push(newNode);
          break;
        default:
          if (typeof position !== 'number') {
            throw new Error(
              `Invalid argument for 'position': expected "start", "end", or a number, but received: ${JSON.stringify(position)}.`
            );
          }
          if (position < 0 || position > siblings.length) {
            throw new Error(
              `Invalid position value: ${position}. Must be between 0 and ${siblings.length} (inclusive) for parent node with id '${parentNode.id}'.`
            );
          }
          siblings.splice(position, 0, newNode);
          break;
      }

      setChildren?.(parentNode.data, siblings);

      setFn?.(prev => {
        const copy = [...prev];
        refresh(copy);
        return copy;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getNodeById, setFn, expandedMap, idToIndex, refresh, setChildren]
  );

  return createNode;
};
