import { useMemo, useRef } from 'react';

import type {
  ExpandedMap,
  NodeData,
  IdAccessor,
  ChildrenAccessor,
  FlatTree,
  Actions,
  SetChildren,
  T,
} from '../types';

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
} from '.';

export interface UseFlatTreeArgs {
  idAccessor?: IdAccessor;
  childrenAccessor?: ChildrenAccessor;
  setChildren?: SetChildren;
  tree: NodeData[];
  setFn?: React.Dispatch<React.SetStateAction<T>>;
  protectedFields?: string[];
}

const defaultIdAccessor = (node: NodeData): unknown => node.id;

const defaultChildrenAccessor = (node: NodeData): unknown => node.children;

export const useFlatTree = ({
  tree,
  idAccessor = defaultIdAccessor,
  childrenAccessor = defaultChildrenAccessor,
  setChildren,
  setFn,
  protectedFields = [],
}: UseFlatTreeArgs): FlatTree => {
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
  const idToIndex = useIdToIndex({ flatTree });

  const getNodeById = useGetNodeById({
    flatTree,
    idToIndex,
  });

  const toggleNode = useToggleNode({
    getNodeById,
    expandedMap,
    idToIndex,
    setFlatTree,
  });
  const deleteNode = useDeleteNode({
    getNodeById,
    expandedMap,
    idToIndex,
    accessChildren,
    setFn,
    refresh,
  });
  const updateNode = useUpdateNode({
    protectedFields: protectedFieldsRef.current,
    getNodeById,
    setFn,
  });
  const createNode = useCreateNode({
    expandedMap: expandedMap.current,
    getNodeById,
    accessChildren,
    setChildren,
    idToIndex,
    refresh,
    setFn,
  });

  const actions: Actions = useMemo(
    () => ({
      toggle: toggleNode,
      delete: deleteNode,
      update: updateNode,
      create: createNode,
      getNodeById,
    }),
    [deleteNode, updateNode, createNode, toggleNode, getNodeById]
  );

  return {
    data: flatTree,
    refresh,
    actions,
  };
};
