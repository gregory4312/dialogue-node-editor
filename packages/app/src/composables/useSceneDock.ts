// Copyright (c) 2025 Aevarkan
// Licensed under the GPLv3 license

export function useSceneDock() {

  const dockedScenes = new Set<string>()
  const listeners = {
    onDockScene: [] as ((sceneId: string) => void)[],
    onUndockScene: [] as ((sceneId: string) => void)[]
  }

  function dockScene(sceneId: string) {
    const alreadyDocked = (dockedScenes.has(sceneId))
    if (alreadyDocked) return

    dockedScenes.add(sceneId)
    listeners.onDockScene.forEach(fn => fn(sceneId))
  }

  function undockScene(sceneId: string) {
    const wasDeleted = dockedScenes.delete(sceneId)
    if (!wasDeleted) return

    listeners.onUndockScene.forEach(fn => fn(sceneId))
  }

  function onDockScene(callback: (sceneId: string) => void) {
    listeners.onDockScene.push(callback)
  }

  function onUndockScene(callback: (sceneId: string) => void) {
    listeners.onUndockScene.push(callback)
  }

  function isSceneDocked(sceneId: string) {
    return dockedScenes.has(sceneId)
  }

  function getDockedSceneIds() {
    return Array.from(dockedScenes)
  }


  return { dockScene, undockScene, onDockScene, onUndockScene, isSceneDocked, getDockedSceneIds }
}
