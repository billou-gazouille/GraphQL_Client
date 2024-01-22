import { useEffect, useState } from "react";

const DEFAULT_OPTIONS = {
    method: 'GET',
	headers: { 'Content-Type': 'application/json' },
};
const DEFAULT_TIMEOUT = 10_000; // 10 sec

export default function useFetch({ url, options = DEFAULT_OPTIONS, timeout = DEFAULT_TIMEOUT }) {
    const [isPending, setIsPending] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const timeoutPromise = (delay) => {
        return new Promise((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            clearTimeout(timeoutId);
            reject({ error: 'Timeout' });
          }, delay);
        });
      };

    useEffect(() => {

        setData(null);
        setError(null);
        setIsPending(true);

        const abortController = new AbortController();

        const fetchData = () => {
            return fetch(url, {
                ...options,
                signal: abortController.signal,
            })
            .then((resp) => {
                if (!resp.ok) throw new Error("Network request failed");
                return resp.json();
            })
            .then((data) => ({ data }))
            .catch((error) => {
                throw { error: error.message || "Unknown error" };
            });
        };

        Promise.race([fetchData(), timeoutPromise(timeout)])
            .then(({ data }) => {
                setData(data);
                setError(null);
            })
            .catch(({ error }) => {
                setError(error);
            })
            .finally(() => {
                setIsPending(false);
            });

        return () => {
            abortController.abort();
        };
    }, [url]);

    return { isPending, data, error };
};