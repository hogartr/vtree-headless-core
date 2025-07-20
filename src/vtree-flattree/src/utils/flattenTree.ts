import type { ExpandedMap, AccessId, AccessChildren, Node, NodeData } from "../types";
import { ROOT_NODE_ID } from "../variables/kinds";

type FlattenTree = {
  tree: NodeData[];
  expandedMap: ExpandedMap;
  accessId: AccessId;
  accessChildren: AccessChildren;
  parent?: Node;
}

export const flattenTree = ({ tree, expandedMap, accessId, accessChildren, parent }: FlattenTree) => {
  const flatTree: Node[] = [];

  const rootNode: Node = parent || {
    id: ROOT_NODE_ID,
    parent: null,
    children: null,
    data: {},
    level: -1,
    expanded: true,
  }

  const startLevel = parent ? parent.level + 1 : 0;
  
  const appendNodes = (
    nodes: NodeData[], 
    result: Node[], 
    parent: Node | null, 
    level: number, 
    isVisible: boolean
  ): void => {
    for (const node of nodes) {
      const id = accessId(node)
      const newNode: Node = {
        id,
        children: null,
        parent,
        data: node,
        level,
        expanded: false
      }
      if (isVisible) {
        result.push(newNode);
      }
      if (parent !== null) {
        if (parent.children === null) {
          parent.children = [] as Node[]
        }
        parent.children.push(newNode);
      }
      const children = accessChildren(node);
      const isExpanded = expandedMap.has(id);
      const childrenVisible = isExpanded && isVisible
      if (children !== null && childrenVisible) {
        newNode.expanded = true;
      }
      if (children) {
        appendNodes(
          children, 
          result, 
          newNode, 
          level + 1, 
          childrenVisible
        );
      }
    }
  }
  appendNodes(tree, flatTree, rootNode, startLevel, true);

  return flatTree;
}