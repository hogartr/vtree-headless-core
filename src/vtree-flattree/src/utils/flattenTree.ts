import type { ExpandedMap, AccessId, AccessChildren, Node, NodeData } from "../types";
const ROOT_NODE_ID = "__ROOT_NODE__";

type FlattenTree = {
  tree: NodeData[];
  expandedMap: ExpandedMap;
  accessId: AccessId;
  accessChildren: AccessChildren;
}

export const flattenTree = ({ tree, expandedMap, accessId, accessChildren }: FlattenTree) => {
  const flatTree: Node[] = [];

  const rootNode: Node = {
    id: ROOT_NODE_ID,
    parent: null,
    children: null,
    data: {},
    level: -1,
    expanded: true,
  }
  
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
  appendNodes(tree, flatTree, rootNode, 0, true);

  return flatTree;
}