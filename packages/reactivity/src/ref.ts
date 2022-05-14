import { isObject } from "@vue/shared";
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