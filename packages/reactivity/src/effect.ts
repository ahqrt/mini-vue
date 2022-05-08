/**
 * 当前激活的effect
 */
export let activeEffect = undefined


function cleanupEffect(effect: ReactiveEffect) {
  // 
  const { deps } = effect
  for (let i = 0; i < deps.length; i++) {
    /**
     * 解除effect，重新依赖收集
     */
    deps[i].delete(effect)
  }

  effect.deps.length = 0
}

class ReactiveEffect {
  /**
   * effect默认是激活状态
   */
  active = true
  /**
   * 这个属性的作用就是当存在嵌套的effect的时候
   * 形成一个类似树形结构的东西，将当前的activeEffect和之前的activeEffect进行绑定
   * 这样当当前的activeEffect执行完毕之后，在获取之前的activeEffect
   * 
   */
  parent = null

  /**
   * 记录所有依赖的属性的dep
   */
  deps = []

  constructor(public fn) {
    this.fn = fn
  }

  /**
   * 执行effect
   */
  run() {
    /**
     * 如果是非激活的情况，只需要执行函数，不进行依赖收集
     */
    if (!this.active) {
      this.fn()
    }

    /**
     * 这里就要进行依赖收集，核心就是将当前的effect 和稍后要渲染的属性进行绑定
     * 当稍后进行取值操作的时候，就可以获取activeEffect
     */
    try {
      // 将当前的effect和之前的effect进行绑定
      this.parent = activeEffect

      activeEffect = this

      // 这里需要在执行用户函数之前，将之前收集的依赖进行清空
      cleanupEffect(this)
      return this.fn()
    } finally {
      activeEffect = this.parent
      this.parent = null
    }
  }
  stop() {
    this.active = false
  }
}

export function effect(fn) {
  // fn 可以根据状态的变化重新执行，effect可以嵌套使用
  // 比如vue的组件就是嵌套 effect 执行render函数
  const _effect = new ReactiveEffect(fn);

  _effect.run()
}



// 对象 => 某个属性 => 多个effect, 所以设计出来的结构可以看书中的内容
const targetMap = new WeakMap()
/**
 * 
 * @param target 
 * @param key 
 */
export function track(target: object, key: string | symbol) {
  if (!activeEffect) return

  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }

  let deps = depsMap.get(key)
  if (!deps) {
    depsMap.set(key, (deps = new Set()))
  }

  let shouldTrack = !deps.has(activeEffect)
  if (shouldTrack) {
    deps.add(activeEffect)
    activeEffect.deps.push(deps)
  }
}


/**
 * 
 * @param target 
 * @param key 
 * @param value 
 * @param oldValue 
 */
export function trigger(target: object, key: string | symbol, value: any, oldValue: any) {
  debugger
  const depsMap = targetMap.get(target)
  if (!depsMap) {
    return
  }

  const effects: Set<ReactiveEffect> = new Set(depsMap.get(key))
  effects && effects.forEach(effect => {
    // 不能无限循环调用自己
    if (effect !== activeEffect) {
      effect.run()
    }
  })

}