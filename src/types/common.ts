export type T = any;

export type NodeData = Record<string, T>;

export type NodeId = string | number;

export type ToggleNode = (arg: Node | NodeId) => void;

export type Node = {
  id: NodeId;
  parent: Node | null;
  children: Node[] | null;
  data: NodeData;
  level: number;
  expanded: boolean;
};

export type FlatTree = {
  data: Node[];
  refresh: () => void;
  toggleNode: ToggleNode
}