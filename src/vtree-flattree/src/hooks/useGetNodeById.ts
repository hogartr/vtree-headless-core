import { useCallback } from "react"
import type { NodeId, Node, IdToIndex, GetNodeById } from "../types"

export const useGetNodeById = (flatTree: Node[], idToIndex: IdToIndex) => {
  const getNodeById: GetNodeById = useCallback((id: NodeId): Node => {
    const index = idToIndex(id);
    return flatTree[index]
  }, [flatTree, idToIndex])

  return getNodeById;
}