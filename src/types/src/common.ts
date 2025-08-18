import type { Actions } from './actions';
import type { NodeId, NodeData, Node } from './node';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type T = any;

export type Update = (arg: Node | NodeId) => void;

export type GetNodeById = (id: NodeId) => Node;

export type Refresh = (treeArg?: NodeData[]) => void;

export type SetChildren = (node: NodeData, children: NodeData[]) => void;

export interface FlatTree {
  data: Node[];
  refresh: Refresh;
  actions: Actions;
}
