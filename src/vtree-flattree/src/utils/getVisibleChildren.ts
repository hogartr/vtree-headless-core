import type { Node } from '@vtree-headless/types';

import type { ExpandedMap } from '../types';

export const getVisibleChildren = (node: Node, expandedMap: ExpandedMap): Node[] => {
  const visibleChildren: Node[] = [];
  if (node.children === null || node.children.length === 0) {
    return visibleChildren;
  }
  const populateVisibleChildren = (nodes: Node[], result: Node[]) => {
    for (let i = 0; i < nodes.length; i++) {
      result.push(nodes[i]);
      if (nodes[i].children !== null && expandedMap.has(nodes[i].id)) {
        populateVisibleChildren(nodes[i].children as Node[], result);
      }
    }
  };
  populateVisibleChildren(node.children, visibleChildren);

  return visibleChildren;
};
