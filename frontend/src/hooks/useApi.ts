import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Generic hook for API data fetching with loading, error, and refresh support.
 *
 * Usage:
 *   const { data, loading, error, refetch } = useApi(() => productsApi.getAll());
 *   const { data, loading, error } = useApi(() => productsApi.getBySlug(slug), [slug]);
 */

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  refetch: () => Promise<void>;
  setData: (data: T | null) => void;
}

export function useApi<T>(
fetcher: () => Promise<T>,
deps: any[] = [])
: UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null
  });

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const result = await fetcherRef.current();
      setState({ data: result, loading: false, error: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setState((prev) => ({ ...prev, loading: false, error: message }));
    }
  }, deps);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const setData = useCallback((data: T | null) => {
    setState((prev) => ({ ...prev, data }));
  }, []);

  return {
    ...state,
    refetch: fetchData,
    setData
  };
}

/**
 * Hook for API mutations (POST, PUT, DELETE) with loading and error states.
 *
 * Usage:
 *   const { mutate, loading, error } = useMutation(contactApi.submit);
 *   const handleSubmit = () => mutate(formData);
 */

interface UseMutationReturn<TInput, TOutput> {
  mutate: (input: TInput) => Promise<TOutput | null>;
  loading: boolean;
  error: string | null;
  reset: () => void;
}

export function useMutation<TInput, TOutput>(
mutationFn: (input: TInput) => Promise<TOutput>)
: UseMutationReturn<TInput, TOutput> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (input: TInput): Promise<TOutput | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await mutationFn(input);
        setLoading(false);
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An error occurred';
        setError(message);
        setLoading(false);
        return null;
      }
    },
    [mutationFn]
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return { mutate, loading, error, reset };
}