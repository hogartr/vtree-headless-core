import type { Node } from "../types";

export const insertAt = (array: Node[], index: number, newNodes: Node[]): Node[] => [
  ...array.slice(0, index + 1),
  ...newNodes,
  ...array.slice(index + 1),
];

export const removeAt = (array: Node[], index: number, count: number): Node[] => [
  ...array.slice(0, index + 1),
  ...array.slice(index + 1 + count),
];