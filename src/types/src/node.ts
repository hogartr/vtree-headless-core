import type { T } from './common';

export type NodeData = Record<string, T>;

export type NodeId = string | number;

export interface Node {
  id: NodeId;
  parent: Node | null;
  children: Node[] | null;
  data: NodeData;
  level: number;
  expanded: boolean;
}
