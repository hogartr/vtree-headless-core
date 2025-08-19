# vtree-headless-core 🌲

A modular **headless React tree library** designed for **performance, scalability, and developer freedom**.  
Split into two packages for maximum flexibility:

- **`@vtree-headless/flattree`** → core logic for flattening and managing tree state  
- **`@vtree-headless/render`** → rendering utilities for virtualization and UI integration  

Together, they enable smooth handling of **10,000+ nodes**, with support for expand/collapse, mutations, and high-performance rendering.  

---

## ✨ Features

- 🔄 **Headless architecture** – use only what you need (flattree or flattree + rendering).  
- 📂 **Expand/Collapse** – efficient recalculation of visible nodes.  
- ⚡ **Performance-first design** – proven to handle **10,000+ nodes smoothly**.  
- ➕ **Tree mutations** – expand/collapse, add, delete, update nodes via clean APIs.
- 🎨 **Rendering utilities** – integrate with React Window, Virtuoso, or roll your own.  
- 🧩 **TypeScript support** – strong typing for predictable development.

---

## 🚀 Installation

```bash
# Core tree state + flattening
npm install @vtree-headless/flattree

# Rendering helpers (optional)
npm install @vtree-headless/render
```

## 🛠️ Usage
# Core (Flattening + State Management)
```tsx
import { useFlatTree } from "@vtree-headless/flattree";

const data = [
  { id: "1", name: "Root", children: [{ id: "2", name: "Child" }] }
];

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
    <ul>
      {flatTree.data.map(node => (
        <li key={node.id}>
          {node.name}
          <button onClick={() => tree.toggleNode(node.id)}>
            {node.isExpanded ? "Collapse" : "Expand"}
          </button>
        </li>
      ))}
    </ul>
  );
}
```
# Rendering with Virtualization
```tsx
import { useFlatTree } from "@vtree-headless/flattree";
import { VariableSizeTree, AutoSizer } from "@vtree-headless/render";

interface RowProps {
  node: Node;
  flatTree: FlatTree;
  style: React.CSSProperties;
}

const Row = ({ node, flatTree, style }: RowProps): React.ReactNode => (
  <div style={style}>
    ...
  </div>
);

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
```

## 📊 Example Use Cases

- Large-scale directory structures (file explorers, IDE-like UIs).
- Enterprise SaaS apps with deeply nested data (projects, org charts, configs).
- Optimized frontends where 10k+ nodes need to remain smooth and responsive.

## 🏗️ Roadmap

- Improve README + documentation
- Drag-and-drop support
- Add Unit testing
- Benchmarks & performance dashboard

## 📈 Performance

Both packages are designed to handle 10,000+ nodes efficiently.
@vtree-headless/flattree maintains a map of nodes for fast lookups, while @vtree-headless/render ensures only visible nodes are rendered.

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 📜 License

MIT