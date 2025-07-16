import { useRef } from "react";
import { 
  useAccessId, 
  useAccessChildren, 
  useIdToIndex, 
  useFlatTreeState, 
  useGetNodeById 
} from ".";
import type { 
  ExpandedMap, 
  NodeData, 
  IdAccessor, 
  ChildrenAccessor, 
  IsLeaf, 
  FlatTree,
} from "../types";
import { useToggleNode } from "./useToggleNode";

export type UseFlatTreeArgs = {
  idAccessor?: IdAccessor;
  childrenAccessor?: ChildrenAccessor;
  tree: NodeData[];
}

const defaultIdAccessor = (node: NodeData): unknown => node.id;

const defaultChildrenAccessor = (node: NodeData): unknown => node.children

export const useFlatTree = ({ tree, idAccessor = defaultIdAccessor, childrenAccessor = defaultChildrenAccessor }: UseFlatTreeArgs): FlatTree => {
  const accessId = useAccessId(idAccessor);
  const accessChildren = useAccessChildren(childrenAccessor);
  const expandedMap = useRef<ExpandedMap>(new Map()); 

  const { flatTree, setFlatTree, refresh } = useFlatTreeState({
    tree,
    expandedMap: expandedMap.current,
    accessChildren: accessChildren,
    accessId,
  });
  const idToIndex = useIdToIndex(flatTree);

  const getNodeById = useGetNodeById(flatTree, idToIndex);

  const toggleNode = useToggleNode(getNodeById, expandedMap, idToIndex, setFlatTree);

  return {
    data: flatTree,
    refresh,
    toggleNode,
  }
}