import { FixedSizeList as List } from "react-window";
import type { ComponentType } from "react";
import type { FixedSizeList } from "react-window";
import type { FlatTree, Node } from "../types";
import type React from "react";

type RowProps = {
  flatTree: FlatTree;
  index: number;
  node: Node;
  style: React.CSSProperties;
}

type RowComponent = ComponentType<RowProps>;

type FixedSizeTreeProps = {
  children: RowComponent;
  flatTree: FlatTree;
  ref?: React.Ref<FixedSizeList<any>> | undefined;
  width: number;
  height: number;
  itemSize: number;
  overscanCount?: number;
}

export const FixedSizeTree = ({ children: Row, flatTree, width, height, itemSize, ref, overscanCount = 0, ...rest }: FixedSizeTreeProps) => 
  <List
    ref={ref}
    itemData={flatTree.data}
    itemCount={flatTree.data.length}
    width={width}
    height={height}
    itemSize={itemSize}
    itemKey={(index, data) => data[index].id}
    overscanCount={overscanCount}
    { ...rest }
  >
    {({index, data, style}) => <Row flatTree={flatTree} index={index} node={data[index]} style={style} />}
  </List>