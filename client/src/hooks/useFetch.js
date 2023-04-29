import { useState, useEffect, useCallback } from 'react';

const DEFAULT_OPTIONS = {
    headers: { "Content-Type": "application/json" },
    credentials: 'include',
}

/**
* @param {String} url - Endpoint
* @param {Object} options - Should be memoized ! (with useMemo hook)
*/
const useFetch = (url, options = {}, dependencies = [], dontRun) => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(undefined);
    const [value, setValue] = useState(undefined);
    const [rel, setRel] = useState(false);

    const fetchAgain = useCallback(() => {
        setRel(prev => !prev);
    }, []);

    useEffect(() => {

        if (dontRun) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(undefined);
        setValue(undefined);

        const controller = new AbortController();
        const signal = controller.signal;

        fetch(url, { signal, ...DEFAULT_OPTIONS, ...options })
            .then(async res => {
                if (res.ok) return res.json()
                const json = await res.json();
                return await Promise.reject(json);
            })
            .then(res => {
                setValue(res);
                setLoading(false)
            })
            .catch(err => {
                if (err.name === "AbortError") {
                    console.log("Fetch Cancelled !", url);
                } else {
                    setError(err);
                    setLoading(false);
                }
            });

        return () => {
            controller.abort();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...dependencies, rel]);

    return { loading, error, value, setValue, setError, fetchAgain };
}

export default useFetch;

export const justFetch = (url, options, onstart, onsuccess, onreject, onend) => {

    onstart && onstart();
    options = options ? options : {};

    const controller = new AbortController();
    const signal = controller.signal;

    fetch(url, { signal, ...DEFAULT_OPTIONS, ...options })
        .then(async res => {
            if (res.ok) return res.json()
            const json = await res.json();
            return await Promise.reject(json);
        })
        .then(onsuccess ? onsuccess : () => { })
        .catch(err => {
            if (err.name === "AbortError") {
                console.log("Fetch Cancelled !", url);
            } else {
                onreject && onreject(err);
            }
        })
        .finally(onend ? onend : () => { });

    const abort = () => controller.abort();

    return abort;
}
