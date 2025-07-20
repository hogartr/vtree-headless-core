import { useVirtualizer, type Virtualizer, type Key } from "@tanstack/react-virtual";
import { useCallback, useEffect, useMemo, useRef, type ComponentType } from "react";
import type { FlatTree, Node } from "../types";
import React from "react";

type RowProps = {
  flatTree: FlatTree;
  node: Node;
  style: React.CSSProperties;
}

type ItemSize = (node: Node) => number

type RowComponent = ComponentType<RowProps>;

type VariableSizeTreeProps = {
  children: RowComponent;
  flatTree: FlatTree;
  ref?: React.RefObject<Virtualizer<HTMLDivElement, Element>> | undefined;
  width: number;
  height: number;
  itemSize: ItemSize;
  overscan?: number;
  testId?: string;
}

export const VariableSizeTree = React.memo(({ children: Row, flatTree, width, height, itemSize, ref, overscan = 0, testId }: VariableSizeTreeProps) => {
  const parentRef = useRef<HTMLDivElement>(null)

  const getItemSize = useCallback(itemSize, []);
  const getItemKey = useCallback((index: number) => flatTree.data[index].id, [flatTree.data]);

  const rowVirtualizer = useVirtualizer({
    count: flatTree.data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => getItemSize(flatTree.data[index]),
    getItemKey,
    overscan,
  })

  if (ref) {
    ref.current = rowVirtualizer;
  }

  return (
    <div
      ref={parentRef}
      style={{
        width,
        height,
        overflow: 'auto',
      }}
      data-testid={testId}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map(({ index, start, key }) => 
          <RenderRow index={index} start={start} flatTree={flatTree} Row={Row} getItemSize={getItemSize} key={key}/>
        )}
      </div>
    </div>
  )
})

type RenderRowProps = {
  Row: RowComponent;
  start: number;
  index: number;
  flatTree: FlatTree;
  getItemSize: ItemSize;
  key: Key;
}

const RenderRow = React.memo(({index, start, flatTree, Row, getItemSize}: RenderRowProps) => {
  const height = getItemSize(flatTree.data[index]);
  const style: React.CSSProperties = useMemo(() => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: `${height}px`,
    transform: `translateY(${start}px)`,
  }), [start, height])
  return (
    <Row
      style={style}
      flatTree={flatTree}
      node={flatTree.data[index]} 
    />
  )
})
        