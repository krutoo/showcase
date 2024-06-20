export function debounce(fn: VoidFunction, timeout: number): VoidFunction {
  let timerId: any;

  return () => {
    clearTimeout(timerId);
    timerId = setTimeout(fn, timeout);
  };
}
