import { isArray, isObject } from "@vue/shared";
import { ReactiveEffect, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";

function toReactive(value) {
  return isObject(value) ? reactive(value) : value;
}

class RefImpl {
  private _value = undefined;
  public __v_isRef = true;
  public dep = new Set<ReactiveEffect>()
  constructor(public rawValue) {
    this._value = toReactive(rawValue);
  }

  get value() {
    trackEffects(this.dep);
    return this._value;
  }

  set value(newValue) {
    if (this.rawValue === newValue) {
      return
    }
    this._value = toReactive(newValue);
    this.rawValue = newValue;
    triggerEffects(this.dep);
  }

}

export function ref(value) {
  return new RefImpl(value)
}

export function toRef(object, key) {
  return new ObjectRefImpl(object, key)
}

class ObjectRefImpl {
  constructor(public object, public key) {

  }

  get value() {
    return this.object[this.key]
  }

  set value(newValue) {
    this.object[this.key] = newValue
  }
}

/**
 * 
 * @param value 传入的对象
 * @returns 
 */
export function toRefs(value) {
  if (!isObject(value)) {
    return
  }
  const result = isArray(value) ? new Array(value.length) : {};

  for (const key in value) {
    result[key] = toRef(value, key);
  }

  return result
}