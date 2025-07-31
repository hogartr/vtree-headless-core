import React, { useCallback } from 'react';

import type { Node, NodeId, GetNodeById, UpdateNode, NodeData } from '../../types';
import { isValidNodeId } from '../../utils';

interface UseUpdateNodeArgs {
  getNodeById: GetNodeById;
  setFn: React.Dispatch<React.SetStateAction<NodeData[]>> | undefined;
  protectedFields: string[];
}

export const useUpdateNode = ({
  getNodeById,
  setFn,
  protectedFields,
}: UseUpdateNodeArgs): UpdateNode => {
  const updateNode = useCallback(
    (arg: Node | NodeId, fields: NodeData) => {
      if (!fields || Object.keys(fields).length === 0) {
        return;
      }
      let tempNode = arg;
      if (isValidNodeId(arg)) {
        tempNode = getNodeById(arg as NodeId);
      }
      const node = tempNode as Node;

      for (const [key, value] of Object.entries(fields)) {
        console.log(`Processing field: ${key} = ${value}`);
        if (protectedFields.includes(key)) {
          continue;
        }
        node.data[key] = value;
      }

      setFn?.(prev => [...prev]);
    },
    [getNodeById, protectedFields, setFn]
  );

  return updateNode;
};
