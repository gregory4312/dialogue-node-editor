// Copyright (c) 2025 Aevarkan
// Licensed under the GPLv3 license

import type { Edge } from "@vue-flow/core";

/**
 * Creates an edge for a child node.
 */
export function makeChildEdge(parentSceneId: string, nodeId: string) {
  const edge: Edge = {
    id: `e-${nodeId}`,
    source: parentSceneId,
    target: nodeId
  }
  return edge
}
