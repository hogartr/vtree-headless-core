import React, { useCallback } from "react";
import type { Node, NodeId, SetFlatTree, GetNodeById, ExpandedMap, IdToIndex, Update, NodeData } from "../../types";
import { isValidNodeId, getVisibleChildren, removeAt } from "../../utils";
import type { AccessChildren } from '../../types/accessors';
import { ROOT_NODE_ID } from "../../variables/kinds";

type CreateAction = (data: NodeData, parentId: NodeId, index: number) => void;
type UpdateAction = (data: Partial<NodeData>) => void;
type DeleteAction = (arg: Node | NodeId) => void;

type Actions = {
  create: CreateAction;
  update: UpdateAction;
  delete: DeleteAction;
  node?: Node | null;
}

export const useUpdate = (
  getNodeById: GetNodeById,
  expandedMap: React.RefObject<ExpandedMap>, 
  idToIndex: IdToIndex, 
  setFlatTree: SetFlatTree,
  accessChildren: AccessChildren,
  setFn: React.Dispatch<React.SetStateAction<NodeData[]>>,
): Update => {
  const update = useCallback((arg: Node | NodeId, callback: (actions: Actions) => void) => {
    let tempNode = arg;
    if (isValidNodeId(arg)) {
      tempNode = getNodeById(arg as NodeId);
    }
    const node = tempNode as Node;

    const index = idToIndex(node.id);
    const visibleChildren = node.expanded ? getVisibleChildren(node, expandedMap.current) : [];
    setFlatTree((prev) => {
      return removeAt(prev, index - 1, visibleChildren.length + 1);
    });

    setFn((prev) => {
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
  }, [getNodeById, expandedMap, idToIndex, setFlatTree])

  return update;
}