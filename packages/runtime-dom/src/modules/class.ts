/**
 * 
 * @param el 
 * @param next 
 */
export function patchClass(el: HTMLElement, next) {
  if (next === null) {
    el.removeAttribute('class')
  }
  else {
    el.className = next
  }
}