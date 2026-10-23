type DebouncedFunction<DFArgs extends unknown[]> = ((...args: DFArgs) => void) & {
  cancel: () => void;
  flush: () => void;
};

export default function debounce<Args extends unknown[]>(
  func: (...args: Args) => void,
  wait: number,
): DebouncedFunction<Args> {
  let timerId: ReturnType<typeof setTimeout> | null = null;
  let lastReceivedArgs: Args | undefined;
  let bindedFunc: (...args: Args) => void = () => {};

  const timerCallback = () => {
    if (lastReceivedArgs !== undefined) {
      bindedFunc(...lastReceivedArgs);
    }
    timerId = null;
    lastReceivedArgs = undefined;
  };

  function debouncedFunc(this: unknown, ...args: Args) {
    lastReceivedArgs = args;
    if (timerId !== null) {
      clearTimeout(timerId);
    }
    bindedFunc = func.bind(this);
    timerId = setTimeout(timerCallback, wait);
  }

  function cancel() {
    if (timerId === null) {
      return;
    }
    clearTimeout(timerId);
    timerId = null;
    lastReceivedArgs = undefined;
  }

  function flush() {
    if (timerId === null) {
      return;
    }
    clearTimeout(timerId);
    timerCallback();
  }

  return Object.assign(debouncedFunc, { cancel, flush });
}
