// Copyright (c) 2025 Aevarkan
// Licensed under the GPLv3 license

import { markRaw } from "vue";
import SceneNode from "./SceneNode.vue";
import ButtonSlotNode from "./ButtonSlotNode.vue";

export const nodeTypes = {
  scene: markRaw(SceneNode),
  buttonSlot: markRaw(ButtonSlotNode)
}
