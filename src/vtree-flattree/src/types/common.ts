import type { NodeId, Node } from "../../../types"

export type IdToIndex = (node: NodeId) => number;

export type ExpandedMap = Map<NodeId, boolean>;
export type SetFlatTree = React.Dispatch<React.SetStateAction<Node[]>>;

