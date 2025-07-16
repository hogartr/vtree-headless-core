import { useVirtualizer, type Virtualizer } from "@tanstack/react-virtual";
import { useCallback, useMemo, useRef, type ComponentType } from "react";
import type { FlatTree, Node } from "../types";
import type React from "react";

type RowProps = {
  flatTree: FlatTree;
  node: Node;
  style: React.CSSProperties;
}

type ItemSize = (node: Node) => number

type RowComponent = ComponentType<RowProps>;

type FixedSizeTreeProps = {
  children: RowComponent;
  flatTree: FlatTree;
  ref?: React.RefObject<Virtualizer<HTMLDivElement, Element>> | undefined;
  width: number | string;
  height: number | string;
  itemSize: ItemSize;
  overscan?: number;
}

export const VariableSizeTree = ({ children: Row, flatTree, width, height, itemSize, ref, overscan = 0, ...rest }: FixedSizeTreeProps) => {
  const parentRef = useRef<HTMLDivElement>(null)

  const getItemSize = useCallback(itemSize, []);


  const rowVirtualizer = useVirtualizer({
    count: flatTree.data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => getItemSize(flatTree.data[index]),
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
      {...rest}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map(({ index, start }) => 
          <RenderRow index={index} start={start} flatTree={flatTree} Row={Row} getItemSize={getItemSize} />
        )}
      </div>
    </div>
  )
}

type RenderRowProps = {
  Row: RowComponent;
  start: number;
  index: number;
  flatTree: FlatTree;
  getItemSize: ItemSize;
}

const RenderRow = ({index, start, flatTree, Row, getItemSize}: RenderRowProps) => {
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
      key={flatTree.data[index].id}
      style={style}
      flatTree={flatTree}
      node={flatTree.data[index]} 
    />
  )
}
        