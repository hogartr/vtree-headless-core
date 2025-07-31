import { useVirtualizer, type Virtualizer } from '@tanstack/react-virtual';
import React, { useCallback, useMemo, useRef, type ComponentType } from 'react';

import type { FlatTree, Node } from '../types';

interface RowProps {
  flatTree: FlatTree;
  node: Node;
  style: React.CSSProperties;
}

type ItemSize = (node: Node) => number;

type RowComponent = ComponentType<RowProps>;

interface VariableSizeTreeProps {
  children: RowComponent;
  flatTree: FlatTree;
  ref?: React.RefObject<Virtualizer<HTMLDivElement, Element>> | undefined;
  width: number;
  height: number;
  itemSize: ItemSize;
  overscan?: number;
  testId?: string;
}

// eslint-disable-next-line react/display-name
export const VariableSizeTree = React.memo(
  ({
    children: Row,
    flatTree,
    width,
    height,
    itemSize,
    ref,
    overscan = 0,
    testId,
  }: VariableSizeTreeProps) => {
    const parentRef = useRef<HTMLDivElement>(null);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getItemSize = useCallback((node: Node) => itemSize(node), []);
    const getItemKey = useCallback((index: number) => flatTree.data[index].id, [flatTree.data]);

    const rowVirtualizer = useVirtualizer({
      count: flatTree.data.length,
      getScrollElement: () => parentRef.current,
      estimateSize: index => getItemSize(flatTree.data[index]),
      getItemKey,
      overscan,
    });

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
          {rowVirtualizer.getVirtualItems().map(({ index, start, key }) => (
            <RenderRow
              index={index}
              start={start}
              flatTree={flatTree}
              Row={Row}
              getItemSize={getItemSize}
              key={key}
            />
          ))}
        </div>
      </div>
    );
  }
);

interface RenderRowProps {
  Row: RowComponent;
  start: number;
  index: number;
  flatTree: FlatTree;
  getItemSize: ItemSize;
}

// eslint-disable-next-line react/display-name
const RenderRow = React.memo(({ index, start, flatTree, Row, getItemSize }: RenderRowProps) => {
  const height = getItemSize(flatTree.data[index]);
  const style: React.CSSProperties = useMemo(
    () => ({
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: `${height}px`,
      transform: `translateY(${start}px)`,
    }),
    [start, height]
  );
  return <Row style={style} flatTree={flatTree} node={flatTree.data[index]} />;
});
