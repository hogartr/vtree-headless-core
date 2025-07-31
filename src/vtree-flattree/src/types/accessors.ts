import type { NodeId, NodeData } from './';

export type IsLeaf = (node: NodeData) => boolean;
export type AccessId = (node: NodeData) => NodeId;
export type IdAccessor = (node: NodeData) => unknown;
export type ChildrenAccessor = (node: NodeData) => unknown;

export type AccessChildrenReturn = NodeData[] | null;
export type AccessChildren = (node: NodeData) => AccessChildrenReturn;
