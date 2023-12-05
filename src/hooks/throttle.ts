import throttle from '@/utils/throttle';
import { useEffect, useMemo, useRef } from 'react';

export default function useThrottle(cb: CallableFunction, interval = 500): CallableFunction {
  const ref = useRef<CallableFunction>();

  useEffect(() => {
    ref.current = cb;
  }, [cb]);

  const throttled = useMemo(() => {
    const func = () => {
      ref.current?.();
    };
    return throttle(func, interval);
  }, []);

  return throttled;
}
