import { useState, useEffect, useRef } from 'react';

export function useFetch(api) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([])
    const abortControllerRef = useRef(null);

    const runApiCalls = async (api) => {
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        try {
            setLoading(true);
            const fetchInfo = await fetch(api, signal);
            if (!fetchInfo.ok) {
                throw new Error('Something is not working');
            }
            const result = await fetchInfo.json();
            setData(result);
        } catch (error) {
            console.log(error.message)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        //Run Api Calls
        runApiCalls(api);
        return () => abortControllerRef.current.abort()
    }, [api])

    return { loading, data };
}

