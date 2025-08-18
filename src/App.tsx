import React, { useState } from 'react';
import type { Node, FlatTree } from '@vtree-headless/types';
import { useFlatTree } from '@vtree-headless/flattree';
import { ChevronDownIcon, ChevronRightIcon } from '@icons';

import { cities } from './data/cities';
import { VariableSizeTree, AutoSizer } from './vtree-render/src';
import './App.css';

const App = (): React.ReactNode => {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="flex-none">Virtualized TreeView</h1>
      <div className="w-full h-screen">
        <TreeView />
      </div>
      <p className="read-the-docs flex-none">Click on the Vite and React logos to learn more</p>
    </div>
  );
};

interface RowProps {
  node: Node;
  flatTree: FlatTree;
  style: React.CSSProperties;
}

const Row = ({ node, flatTree, style }: RowProps): React.ReactNode => (
  <RowWrapper node={node} style={style}>
    {node.children?.length && node.children?.length > 0 && (
      <ToggleButton node={node} flatTree={flatTree} />
    )}
    <NodeName>{node.data.name}</NodeName>
    <div className="ml-auto">
      <button
        onClick={() => {
          flatTree.actions.create(
            {
              name: 'Test',
              id: new Date().getMilliseconds(),
              children: null,
            },
            node.id,
            'start'
          );
          if (!node.expanded) {
            flatTree.actions.toggle(node);
          }
        }}
        className="bg-red-500 text-white px-2 py-1 rounded"
      >
        Create
      </button>
    </div>
    <div className="ml-auto">
      <button
        onClick={() => flatTree.actions.update(node, { name: node.data.name + ' HA' })}
        className="bg-red-500 text-white px-2 py-1 rounded"
      >
        Update
      </button>
    </div>
    <div className="ml-auto">
      <button
        onClick={() => {
          flatTree.actions.delete(node);
        }}
        className="bg-red-500 text-white px-2 py-1 rounded"
      >
        Delete
      </button>
    </div>
  </RowWrapper>
);

interface RowWrapper {
  children: React.ReactNode;
  node: Node;
  style: React.CSSProperties;
}

const RowWrapper = ({ children, node, style }: RowWrapper): React.ReactElement => (
  <div
    key={node.id}
    style={{ ...style, marginLeft: 20 * node.level }}
    className="flex flex-row justify-start items-center"
  >
    {children}
  </div>
);

interface ToggleButtonProps {
  node: Node;
  flatTree: FlatTree;
  size?: number;
}

const ToggleButton = ({ node, flatTree, size = 36 }: ToggleButtonProps): React.ReactElement => (
  <div onClick={() => flatTree.actions.toggle(node)}>
    <img width={size} height={size} src={node.expanded ? ChevronDownIcon : ChevronRightIcon} />
  </div>
);

interface NodeNameProps {
  children: string;
}

const NodeName = ({ children }: NodeNameProps): React.ReactElement => <span>{children}</span>;

const TreeView = (): React.ReactNode => {
  const [data, setData] = useState(cities);
  const flatTree = useFlatTree({
    tree: data,
    setFn: setData,
    setChildren: (node, children) => {
      node.children = children;
    },
  });

  return (
    <AutoSizer>
      {({ width, height }) => (
        <VariableSizeTree
          itemSize={node => (node.level > 0 ? 64 : 48)}
          height={height}
          width={width}
          overscan={0}
          flatTree={flatTree}
        >
          {Row}
        </VariableSizeTree>
      )}
    </AutoSizer>
  );
};

export default App;
