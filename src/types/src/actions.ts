import type { GetNodeById } from './common';
import type { NodeId, NodeData, Node } from './node';

export type ToggleNode = (arg: Node | NodeId) => void;

export type DeleteNode = (arg: Node | NodeId) => void;

export type UpdateNode = (arg: Node | NodeId, fields: NodeData) => void;

export type CreateNode = (
  newNode: NodeData,
  parent: Node | NodeId,
  position: 'start' | 'end' | number
) => void;

export interface Actions {
  create: CreateNode;
  update: UpdateNode;
  delete: DeleteNode;
  getNodeById: GetNodeById;
  toggle: ToggleNode;
}
