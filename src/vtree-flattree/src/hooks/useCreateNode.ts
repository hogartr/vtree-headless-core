import React, { useCallback } from "react";
import type { Node, NodeId, SetFlatTree, GetNodeById, CreateNode, NodeData, ExpandedMap, AccessId, AccessChildren, IdToIndex } from "../types";
import { isValidNodeId, flattenTree } from "../utils";

export const useCreateNode = (
  getNodeById: GetNodeById,
  setFlatTree: SetFlatTree,
  setFn: React.Dispatch<React.SetStateAction<NodeData[]>>,
  accessId: AccessId,
  accessChildren: AccessChildren,
  expandedMap: ExpandedMap,
  idToIndex: IdToIndex,
): CreateNode => {
  const createNode: CreateNode = useCallback((newNode, parent, position) => {
    let tempParent = parent;
    if (isValidNodeId(parent)) {
      tempParent = getNodeById(parent as NodeId);
    }
    const parentNode = tempParent as Node;

    if (!newNode || !parentNode) {
      return null;
    }

    const flattenedNodes = flattenTree({
      tree: [newNode], 
      expandedMap,
      accessChildren,
      accessId,
      parent: parentNode,
    });

    const [flatRoot] = flattenedNodes;

    if (!flatRoot) {
      return null;
    }

    flatRoot.parent = parentNode;

    const siblings = accessChildren(parentNode.data) || [] as NodeData[];

    switch (position) {
      case "start":
        siblings.unshift(newNode);
        break;
      case "end":
        siblings.push(newNode);
        break;
      default:
        if (position < 0 || position > siblings.length) {
          console.warn("Invalid position for new node");
          return;
        }
        siblings.splice(position, 0, newNode);
        break;
    }

    if (parentNode.expanded) {
      const index = idToIndex(parentNode.id);

      setFlatTree((prev) => [
        ...prev.slice(0, index + 1), // Keep nodes up to the parent
        ...flattenedNodes, // Insert new nodes after the parent
        ...prev.slice(index + 1), // Keep remaining nodes after the parent
      ]);
    } else {
      setFlatTree((prev) => [...prev])
    }

    setFn((prev) => [...prev])

    return flatRoot;
  }, [getNodeById, setFlatTree])

  return createNode;
}