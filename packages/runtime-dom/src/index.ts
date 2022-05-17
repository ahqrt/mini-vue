import { createRenderer } from '@vue/runtime-core'
import { nodeOps } from './nodeOps'
import { patchProp } from './patchProp'

const renderOptions = Object.assign(nodeOps, { patchProp })

export function render(vNode, container) {
  const renderer = createRenderer(renderOptions)
  renderer.render(vNode, container)
}

export * from '@vue/runtime-core'