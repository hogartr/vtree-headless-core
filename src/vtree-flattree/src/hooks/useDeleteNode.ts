import React, { useCallback } from "react";
import type { Node, NodeId, SetFlatTree, GetNodeById, ExpandedMap, IdToIndex, DeleteNode, NodeData } from "../types";
import { isValidNodeId, getVisibleChildren, removeAt } from "../utils";
import type { AccessChildren } from '../types/accessors';
import { ROOT_NODE_ID } from "../variables/kinds";

export const useDeleteNode = (
  getNodeById: GetNodeById,
  expandedMap: React.RefObject<ExpandedMap>, 
  idToIndex: IdToIndex, 
  setFlatTree: SetFlatTree,
  accessChildren: AccessChildren,
  setFn: React.Dispatch<React.SetStateAction<NodeData[]>> | undefined,
  refresh: () => void,
): DeleteNode => {
  const deleteNode = useCallback((arg: Node | NodeId) => {
    let tempNode = arg;
    if (isValidNodeId(arg)) {
      tempNode = getNodeById(arg as NodeId);
    }
    const node = tempNode as Node;

    const parentData = node.parent?.data;
    if (!parentData) {
      console.warn("Cannot delete root node");
      return;
    }

    setFn?.((prev) => {
      const updatedData = [...prev];
      let siblings: NodeData[] = [];
      if (node.parent?.id === ROOT_NODE_ID) {
        siblings = updatedData;
      } else {
        siblings = accessChildren(node.parent?.data || {}) as NodeData[];
      }
      if (!siblings) {
        console.warn("No siblings found for the node");
        return updatedData;
      }
      for (let i = 0; i < (siblings.length || 0); i++) {
        if (siblings[i].id === node.id) {
          siblings.splice(i, 1);
          break;
        }
      }
      return updatedData;
    })

    refresh();
  }, [getNodeById, expandedMap, idToIndex, setFlatTree])

  return deleteNode;
}