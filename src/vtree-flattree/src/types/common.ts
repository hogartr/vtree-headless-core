import type { NodeId } from "../../../types"

export type IdToIndex = (node: NodeId) => number;

export type GetNodeById = (id: NodeId) => Node;

export type ExpandedMap = Map<NodeId, boolean>;
export type SetFlatTree = React.Dispatch<React.SetStateAction<Node[]>>;

