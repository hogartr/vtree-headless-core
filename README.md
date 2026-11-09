# vtree-headless-core

> **Status: experimental, work in progress.** This is an independent exploration of a headless tree architecture for React. The core ideas work, but the API may change and there are no tests yet. See [Known limitations](#known-limitations) and the [Roadmap](#roadmap).

A modular, **headless tree library for React**, split into two packages:

| Package | Purpose |
| --- | --- |
| [`@vtree-headless/flattree`](https://www.npmjs.com/package/@vtree-headless/flattree) | Flattens a nested tree into a list of visible nodes and manages expand/collapse and mutations. No UI. |
| [`@vtree-headless/render`](https://www.npmjs.com/package/@vtree-headless/render) | Optional virtualised rendering for a flat tree, built on [TanStack Virtual](https://tanstack.com/virtual), with per-node row heights. |

You can use `flattree` on its own and render however you like, or combine it with `render` for large trees.

## How it works

1. **Flattening.** Your nested data is converted into a flat array of `Node` objects containing only the rows that are currently visible (top-level nodes, plus descendants of expanded nodes).
2. **Incremental expand/collapse.** Toggling a node splices its visible descendants into or out of the flat array, rather than re-flattening the whole tree.
3. **Separate rendering.** The flat array is rendered by your own components, or by `VariableSizeTree`, which only mounts the rows in view.

Each `Node` wraps your original item:

```ts
interface Node {
  id: string | number;
  parent: Node | null;
  children: Node[] | null;
  data: Record<string, any>; // your original item, e.g. { id, name, children }
  level: number;             // depth, starting at 0
  expanded: boolean;
}
```

Your own fields live on `node.data` (for example `node.data.name`), not on the node itself.

## Installation

```bash
# Core: flattening and tree state
npm install @vtree-headless/flattree

# Optional: virtualised rendering
npm install @vtree-headless/render
```

Both packages require React 17 or later.

## Usage

### Core only (flattening and state)

```tsx
import { useState } from 'react';
import { useFlatTree } from '@vtree-headless/flattree';

const initialData = [
  {
    id: '1',
    name: 'Root',
    children: [
      { id: '2', name: 'Child A' },
      { id: '3', name: 'Child B' },
    ],
  },
];

export const TreeView = () => {
  const [data, setData] = useState(initialData);

  const flatTree = useFlatTree({
    tree: data,
    setFn: setData,
    setChildren: (node, children) => {
      node.children = children;
    },
  });

  return (
    <ul>
      {flatTree.data.map(node => (
        <li key={node.id} style={{ paddingLeft: node.level * 16 }}>
          {node.children && (
            <button onClick={() => flatTree.actions.toggle(node)}>
              {node.expanded ? '▾' : '▸'}
            </button>
          )}
          {node.data.name}
        </li>
      ))}
    </ul>
  );
};
```

### With virtualised rendering

`AutoSizer` fills its parent, so the parent element needs a defined height.

```tsx
import { useState, type CSSProperties } from 'react';
import type { Node, FlatTree } from '@vtree-headless/types';
import { useFlatTree } from '@vtree-headless/flattree';
import { VariableSizeTree, AutoSizer } from '@vtree-headless/render';

interface RowProps {
  node: Node;
  flatTree: FlatTree;
  style: CSSProperties;
}

const Row = ({ node, flatTree, style }: RowProps) => (
  <div style={{ ...style, paddingLeft: node.level * 16 }}>
    {node.children && (
      <button onClick={() => flatTree.actions.toggle(node)}>
        {node.expanded ? '▾' : '▸'}
      </button>
    )}
    {node.data.name}
  </div>
);

export const VirtualTreeView = ({ initialData }: { initialData: Record<string, any>[] }) => {
  const [data, setData] = useState(initialData);

  const flatTree = useFlatTree({
    tree: data,
    setFn: setData,
    setChildren: (node, children) => {
      node.children = children;
    },
  });

  return (
    <div style={{ height: 600 }}>
      <AutoSizer>
        {({ width, height }) => (
          <VariableSizeTree
            flatTree={flatTree}
            width={width}
            height={height}
            itemSize={node => (node.level === 0 ? 48 : 36)}
            overscan={5}
          >
            {Row}
          </VariableSizeTree>
        )}
      </AutoSizer>
    </div>
  );
};
```

## API

### `useFlatTree(options)`

| Option | Type | Description |
| --- | --- | --- |
| `tree` | `NodeData[]` | Your nested data. **Required.** |
| `setFn` | React state setter | Setter for `tree`. Required for `create`, `update` and `delete` to trigger a re-render. |
| `setChildren` | `(node, children) => void` | Writes a new children array onto one of your items. Required for `create`. |
| `idAccessor` | `(node) => id` | Reads an item's ID. Defaults to `node.id`. |
| `childrenAccessor` | `(node) => children` | Reads an item's children. Defaults to `node.children`. |
| `protectedFields` | `string[]` | Fields that `update` will never overwrite. |

Returns `{ data, actions, refresh }`:

- **`data`**: the flat array of currently visible `Node`s.
- **`refresh(tree?)`**: re-flattens from the given tree, or the current one.
- **`actions`**:

| Action | Signature | Behaviour |
| --- | --- | --- |
| `toggle` | `(node \| id) => void` | Expands or collapses a node. |
| `create` | `(newItem, parent: node \| id, position: 'start' \| 'end' \| number) => void` | Inserts `newItem` among the parent's children. Throws if the parent cannot be found or the position is out of range. |
| `update` | `(node \| id, fields) => void` | Shallow-merges `fields` into `node.data`, skipping `protectedFields`. |
| `delete` | `(node \| id) => void` | Removes the node, and its subtree, from your data. |
| `getNodeById` | `(id) => Node` | Looks up a node by ID. Only visible nodes can be found (see limitations). |

### `VariableSizeTree` (from `@vtree-headless/render`)

| Prop | Type | Description |
| --- | --- | --- |
| `flatTree` | `FlatTree` | The object returned by `useFlatTree`. |
| `width`, `height` | `number` | Viewport size in pixels. |
| `itemSize` | `(node) => number` | Row height for a node. Read once on mount (see limitations). |
| `overscan` | `number` | Extra rows rendered above and below the viewport. Default `0`. |
| `children` | component | Row component, receives `{ node, flatTree, style }`. Apply `style` to the row's outer element. |

`AutoSizer` measures its parent with a `ResizeObserver` and passes `{ width, height }` to its child function.

## Running the example app

The repository includes a Vite demo with a tree of US states and cities, including create, edit, delete and expand/collapse controls.

```bash
npm install
npm run dev
```

## Known limitations

These are known gaps in the current version:

- **No automated tests or benchmarks yet.** The library is intended for large trees, but performance has not been formally measured.
- **`itemSize` is captured on first render.** Passing a different `itemSize` function later has no effect.
- **`delete` matches siblings by `id`.** It ignores a custom `idAccessor`.
- **The tree is flattened once on load.** Changes made through `actions` are picked up automatically, but if you replace or change `tree` some other way, call `refresh()`.
- **`getNodeById` only finds visible nodes.** Lookups go through an ID-to-index map of the flat array, so nodes inside collapsed parents are not found.
- **Node objects are mutated in place** (for example `expanded` and `data` fields) rather than replaced immutably.
- **`update` logs each processed field** to the console.

## Roadmap

- Unit tests for flattening and all actions
- Benchmarks for large trees
- Fix the limitations listed above
- Drag-and-drop support
- Clearer documentation and a hosted demo

## Contributing

Issues and pull requests are welcome.

## License

MIT
