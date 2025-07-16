
import { useCallback } from "react";
import type { Node, NodeId, SetFlatTree, GetNodeById, ExpandedMap, IdToIndex, ToggleNode } from "../types";
import { isValidNodeId, getVisibleChildren, insertAt, removeAt } from "../utils";

export const useToggleNode = (
  getNodeById: GetNodeById, 
  expandedMap: React.RefObject<ExpandedMap>, 
  idToIndex: IdToIndex, 
  setFlatTree: SetFlatTree,
): ToggleNode => {
  const toggleNode = useCallback((arg: Node | NodeId) => {
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
    setFlatTree((prev) => {
      if (node.expanded) {
        return insertAt(prev, index, visibleChildren)
      }
      return removeAt(prev, index, visibleChildren.length);
    });
  }, [getNodeById, expandedMap, idToIndex, setFlatTree])

  return toggleNode;
}