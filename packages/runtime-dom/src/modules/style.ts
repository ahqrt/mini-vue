export function patchStyle(el, pre, next) {
  if (pre === next) {
    return;
  }
  for (const key in pre) {
    if (!(key in next)) {
      el.style[key] = '';
    }
  }
  for (const key in next) {
    el.style[key] = next[key];
  }


}