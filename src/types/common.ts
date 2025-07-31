// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type T = any;

export type NodeData = Record<string, T>;

export type NodeId = string | number;

export type ToggleNode = (arg: Node | NodeId) => void;

export type DeleteNode = (arg: Node | NodeId) => void;

export type UpdateNode = (arg: Node | NodeId, fields: NodeData) => void;

export type CreateNode = (
  newNode: NodeData,
  parent: Node | NodeId,
  position: 'start' | 'end' | number
) => void;

export type Update = (arg: Node | NodeId) => void;

export type GetNodeById = (id: NodeId) => Node;

export type Refresh = (treeArg?: NodeData[]) => void;

export type SetChildren = (node: NodeData, children: NodeData[]) => void;

export interface Node {
  id: NodeId;
  parent: Node | null;
  children: Node[] | null;
  data: NodeData;
  level: number;
  expanded: boolean;
}

export interface Actions {
  create: CreateNode;
  update: UpdateNode;
  delete: DeleteNode;
  getNodeById: GetNodeById;
  toggle: ToggleNode;
}

export interface FlatTree {
  data: Node[];
  refresh: Refresh;
  actions: Actions;
}
