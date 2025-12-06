// Copyright (c) 2025 Aevarkan
// Licensed under the GPLv3 license

import { useVueFlow, type ViewportTransform } from "@vue-flow/core";
import { ref } from "vue";
import { useLayout } from "./useLayout";

export function useViewportPan() {
  const { viewport, setViewport } = useVueFlow()
  const { setViewportState } = useLayout()
  const isPanning = ref(false)
  let last = { x: 0, y: 0 }
  // let currentViewportState = { ...viewport.value }

  function onMouseDown(e: MouseEvent) {
    isPanning.value = true
    last = { x: e.clientX, y: e.clientY }
    // @ts-expect-error hacky work-around that works
    document.addEventListener.call(window, 'mousemove', onMouseMove)
    document.addEventListener.call(window, 'mouseup', onMouseUp)
  }

  function onMouseMove(e: MouseEvent) {
    if (!isPanning.value) return

    const dx = e.clientX - last.x
    const dy = e.clientY - last.y
    last = { x: e.clientX, y: e.clientY }

    const updatedViewport: ViewportTransform = {
      x: viewport.value.x + dx,
      y: viewport.value.y + dy,
      zoom: viewport.value.zoom,
    }
    setViewport(updatedViewport)
    setViewportState(updatedViewport)
  }

  function onMouseUp() {
    isPanning.value = false
    // setViewportState(currentViewportState) // to not spam the setter
    // @ts-expect-error hacky work-around that works
    document.removeEventListener.call(window, 'mousemove', onMouseMove)
    document.removeEventListener.call(window, 'mouseup', onMouseUp)
  }

  return { onMouseDown }
}
