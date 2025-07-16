import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useFlatTree } from './vtree-flattree/src';
import { cities } from "./data/cities";
import React, { useState, useEffect } from 'react';
import type { Node } from './vtree-flattree/src/types';
import type { FlatTree } from './types';
import { VariableSizeTree } from './vtree-render';

function App() {
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <TreeView />
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

type RowProps = {
  node: Node;
  flatTree?: FlatTree;
  style: React.CSSProperties;
}

const Row = React.memo(({ node, flatTree, style }: RowProps) => { 
  useEffect(() => () => console.log(`unmounted ${node.data.name}`), [])
  return (
  <div style={style} className='flex flex-row justify-start items-center'>
    {node.children?.length && node.children?.length > 0 && 
      <div onClick={() => flatTree?.toggleNode(node)} style={{width: 24, height: 24, border: "1px solid white"}}>
        <span>{node.expanded ? "-" : "+"}</span>
      </div>
    }
    <span>{node.data.name}</span>
  </div>
)})

const TreeView = () => {
  const [ data, setData ] = useState(cities);
  const flatTree = useFlatTree({
    tree: data,
  })
  return (
    <div className="card" style={{ width: 500, height: 500}}>
      <VariableSizeTree
        itemSize={(node) => node.level > 0 ? 64 : 48}
        height={`500px`}
        width={`500px`}
        overscan={10}
        flatTree={flatTree}
      >
        {({node, flatTree, style}) => <Row style={style} node={node} flatTree={flatTree}/>} 
      </VariableSizeTree>
    </div>
  )
}

export default App
