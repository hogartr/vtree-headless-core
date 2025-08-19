import React, { useState } from 'react';
import type { Node, FlatTree } from '@vtree-headless/types';
import { useFlatTree } from '@vtree-headless/flattree';
import { ChevronDownIcon, ChevronRightIcon, AddIcon, DeleteIcon, EditIcon } from '@icons';
import { VariableSizeTree, AutoSizer } from '@vtree-headless/render';

import { cities } from './data/cities';
import './App.css';

const App = (): React.ReactNode => {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="flex-none">Virtualized TreeView</h1>
      <div className="w-full h-screen">
        <TreeView />
      </div>
      <p className="read-the-docs flex-none pb-5">Drag-and-drop coming soon.</p>
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
    <div className="flex flex-row items-center gap-2">
      {node.children?.length && node.children?.length > 0 && (
        <ToggleButton node={node} flatTree={flatTree} />
      )}
      <NodeName>{node.data.name}</NodeName>
    </div>
    <div className="flex flex-row items-center gap-3 pe-4">
      <IconButton
        icon={AddIcon}
        className="p-2"
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
      />
      <IconButton
        icon={EditIcon}
        className="p-2"
        onClick={() => flatTree.actions.update(node, { name: node.data.name + ' HA' })}
      />
      <IconButton
        icon={DeleteIcon}
        className="p-2"
        onClick={() => {
          flatTree.actions.delete(node);
        }}
      />
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
    style={{ ...style, paddingLeft: 20 * node.level }}
    className="flex flex-row justify-between items-center"
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
  <IconButton
    icon={node.expanded ? ChevronDownIcon : ChevronRightIcon}
    onClick={() => flatTree.actions.toggle(node)}
    size={size}
  />
);

const IconButton = ({
  icon,
  onClick,
  size = 18,
  className = '',
}: {
  icon: string;
  onClick: () => void;
  size?: number;
  className?: string;
}): React.ReactElement => (
  <div onClick={onClick} className={'hover:cursor-pointer hover:bg-gray-700 rounded ' + className}>
    <img width={size} height={size} src={icon} />
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
