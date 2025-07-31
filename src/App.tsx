import { useFlatTree } from './vtree-flattree/src';
import { cities } from "./data/cities";
import React, { useState } from 'react';
import type { Node } from './vtree-flattree/src/types';
import type { FlatTree } from './types';
import { VariableSizeTree, AutoSizer } from './vtree-render/src';
import './App.css'

function App() {
  return (
    <div className='h-screen flex flex-col items-center justify-center gap-4'>
      <h1 className='flex-none'>Virtualized TreeView</h1>
      <div className='flex grow w-full'>
        <TreeView />
      </div>
      <p className="read-the-docs flex-none">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

type RowProps = {
  node: Node;
  flatTree: FlatTree;
  style: React.CSSProperties;
}

const Row = ({ node, flatTree, style }: RowProps) => (
  <div key={node.id} style={{...style, marginLeft: 20 * node.level}} className='flex flex-row justify-start items-center'>
    {node.children?.length && node.children?.length > 0 && 
      <div onClick={() => flatTree.actions.toggle(node)} style={{width: 24, height: 24, border: "1px solid white"}}>
        <span>{node.expanded ? "-" : "+"}</span>
      </div>
    }
    <span>{node.data.name}</span>
    <div className='ml-auto'>
      <button 
        onClick={() => { 
          flatTree.actions.create({ 
            name: "Test", 
            id: new Date().getMilliseconds(), 
            children: null }, node.id, "start"
          )
          if (!node.expanded) {
            flatTree.actions.toggle(node)
          }
        }} 
        className='bg-red-500 text-white px-2 py-1 rounded'
      >Create</button>
    </div>
    <div className='ml-auto'>
      <button onClick={() => flatTree.actions.update(node, { name: node.data.name + " HA"})} className='bg-red-500 text-white px-2 py-1 rounded'>Update</button>
    </div>
    <div className='ml-auto'>
      <button onClick={() => flatTree.actions.delete(node)} className='bg-red-500 text-white px-2 py-1 rounded'>Delete</button>
    </div>
  </div>
)

const TreeView = () => {
  const [ data, setData ] = useState(cities);
  const flatTree = useFlatTree({
    tree: data,
    setFn: setData,
    setChildren: (node, children) => { node.children = children },
  });

  return (
    <AutoSizer>
      {({ width, height }) => 
        <VariableSizeTree
          itemSize={(node) => node.level > 0 ? 64 : 48}
          height={height}
          width={width}
          overscan={0}
          flatTree={flatTree}
        >
          {Row} 
        </VariableSizeTree>
      }
    </AutoSizer>
  )
}

export default App
