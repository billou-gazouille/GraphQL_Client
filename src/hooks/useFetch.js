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
        return new Promise((resolve) => {
            setTimeout(() => resolve({ data: null, error: 'Timeout' }), delay);
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
                signal: abortController.signal 
            })
            .then(resp => {                 
                if (!resp.ok) throw { data: null, error: "cannot fetch" };
                return resp.json();
            })
            .then(data => {
                return { data, error: null };
            })
            .catch(error => {
                const errorMessage = error instanceof Object ? error.error : "Unknown error";
                return { data: null, error: errorMessage };
            });
        };
        Promise.race([fetchData(), timeoutPromise(timeout)])
            .then(({ data, error }) => {
                setData(data);
                setError(error);
                setIsPending(false);
            });
            
        return () => abortController.abort();
    }, [url]);

    return { isPending, data, error };
};