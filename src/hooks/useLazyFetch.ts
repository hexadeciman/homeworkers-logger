import { useCallback, useState } from "react";

const useLazyFetch = <T>({
  url,
  onComplete,
}: {
  url: string;
  onComplete: (data: T) => void;
}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(url);
      const result = await response.json();
      setData(result);
      onComplete(result);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, [onComplete, url]);

  return { fetchData, loading, error, data };
};

export default useLazyFetch;
