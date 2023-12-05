const throttle = (cb: CallableFunction, interval: number) => {
  let lastTime: number = 0;
  return (...args: any[]) => {
    const now = Date.now();
    if (now - lastTime >= interval) {
      cb(...args);
      lastTime = now;
    }
  };
};

export default throttle;
