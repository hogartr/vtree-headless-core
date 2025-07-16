import { VariableSizeList as List, type VariableSizeList } from "react-window";
import { useCallback, useLayoutEffect, useRef, type ComponentType } from "react";
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
  ref?: React.RefObject<VariableSizeList<any>> | undefined;
  width: number;
  height: number;
  itemSize: (node: Node) => number;
  overscanCount?: number;
}

export const VariableSizeTree = ({ children: Row, flatTree, width, height, itemSize, ref, overscanCount = 0, ...rest }: FixedSizeTreeProps) => {
  const listRef = useRef<VariableSizeList<any>>(null);
  const memoItemSize = useCallback((index: number) => itemSize(flatTree.data[index]), [flatTree.data]);

  const finalRef = ref || listRef;

  useLayoutEffect(() => {
    finalRef.current?.resetAfterIndex(0, true);
  }, [flatTree.data])

  return (
    <List
      ref={finalRef}
      itemData={flatTree.data}
      itemCount={flatTree.data.length}
      width={width}
      height={height}
      itemSize={memoItemSize}
      itemKey={(index, data) => data[index].id}
      overscanCount={overscanCount}
      {...rest}
    >
      {({ index, data, style }) => <Row flatTree={flatTree} index={index} node={data[index]} style={style} />}
    </List>
  )
}
