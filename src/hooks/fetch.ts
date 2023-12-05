import { ServerData } from '@/interfaces/serverData';
import { useEffect, useRef, useState } from 'react';

export default function useFetch<T = unknown>(url: string, options?: RequestInit) {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const cancelRequest = useRef<boolean>(false);

  useEffect(() => {
    cancelRequest.current = false;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(url, options);
        if (!res.ok) {
          console.log({ ...res });
          throw new Error(res.statusText);
        }

        const { data } = await res.json() as ServerData<T>;
        if (cancelRequest.current) {
          return;
        }
        setData(data);
      } catch (error) {
        if (cancelRequest.current) {
          return;
        }
        console.log(error);
        setError('Error');
      }
    };

    fetchData();

    return () => {
      cancelRequest.current = true;
    };
  }, [url]);

  return [data, error, loading];
}
