import type { NodeData, T } from '../types';

export const nodeExists = (node: NodeData) => {
  if (!node) {
    throw new Error(`
      The provided node does not exist/is falsy.
    `);
  }
  if (typeof node !== 'object') {
    throw new Error(`
      Node of type 'Object' expected, but received type: ${typeof node}
    `);
  }
};

export const isValidNodeId = (id: T): boolean => {
  if (typeof id === 'string') {
    return true;
  }
  if (typeof id === 'number') {
    return true;
  }
  return false;
};
