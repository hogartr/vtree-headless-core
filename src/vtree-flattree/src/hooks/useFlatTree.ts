import { useMemo, useRef } from "react";
import {
  useAccessId,
  useAccessChildren,
  useIdToIndex,
  useFlatTreeState,
  useGetNodeById,
  useDeleteNode,
  useToggleNode,
  useUpdateNode,
  useCreateNode,
} from ".";
import type {
  ExpandedMap,
  NodeData,
  IdAccessor,
  ChildrenAccessor,
  FlatTree,
  Actions,
} from "../types";

export type UseFlatTreeArgs = {
  idAccessor?: IdAccessor;
  childrenAccessor?: ChildrenAccessor;
  tree: NodeData[];
  setFn: React.Dispatch<React.SetStateAction<any>>;
  protectedFields?: string[];
}

const defaultIdAccessor = (node: NodeData): unknown => node.id;

const defaultChildrenAccessor = (node: NodeData): unknown => node.children

export const useFlatTree = ({ tree, idAccessor = defaultIdAccessor, childrenAccessor = defaultChildrenAccessor, setFn, protectedFields = [] }: UseFlatTreeArgs): FlatTree => {
  const accessId = useAccessId(idAccessor);
  const accessChildren = useAccessChildren(childrenAccessor);
  const expandedMap = useRef<ExpandedMap>(new Map()); 
  const protectedFieldsRef = useRef([...protectedFields]);

  const { flatTree, setFlatTree, refresh } = useFlatTreeState({
    tree,
    expandedMap: expandedMap.current,
    accessChildren: accessChildren,
    accessId,
  });
  const idToIndex = useIdToIndex(flatTree);

  const getNodeById = useGetNodeById(flatTree, idToIndex);

  const toggleNode = useToggleNode(getNodeById, expandedMap, idToIndex, setFlatTree);
  const deleteNode = useDeleteNode(getNodeById, expandedMap, idToIndex, setFlatTree, accessChildren, setFn);
  const updateNode = useUpdateNode(getNodeById, setFlatTree, setFn, protectedFieldsRef.current);
  const createNode = useCreateNode(getNodeById, setFlatTree, setFn, accessId, accessChildren, expandedMap.current, idToIndex);

  const actions: Actions = useMemo(() => ({
    toggle: toggleNode,
    delete: deleteNode,
    update: updateNode,
    create: createNode,
    getNodeById,
  }), [toggleNode, deleteNode]);

  return {
    data: flatTree,
    refresh,
    actions,
  }
}