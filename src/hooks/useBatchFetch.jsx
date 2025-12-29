import { useState, useEffect, useRef } from 'react';


async function RunFetch(api, signal) {
    const runApi = await fetch(api, { signal });
    if (!runApi.ok) throw new Error('API Failed: ' + api);
    return await runApi.json();
}

export function useBatchFetch(apis, limit) {
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [error, setError] = useState("");
    const abortRef = useRef(null);

    useEffect(() => {
        // Guard clause for empty or invalid inputs
        if (!apis || apis.length === 0) {
            setLoading(false);
            return;
        }

        const runApiCalls = async () => {
            const batchData = [];
            setLoading(true);
            setError(""); // Reset error state

            const controller = new AbortController();
            abortRef.current = controller;
            const signal = controller.signal;

            try {
                for (let i = 0; i < apis.length; i += limit) {
                    let batchApis = apis.slice(i, i + limit);
                    const batchResults = await Promise.all(
                        batchApis.map(async (api) => {
                            try {
                                const fetchResults = await RunFetch(api, signal);
                                return { success: true, data: fetchResults };
                            } catch (error) {
                                if (error.name === "AbortError") {
                                    throw error; // Re-throw abort errors
                                }
                                console.log("Error:", error.message);
                                return { success: false, error: error.message };
                            }
                        })
                    );
                    batchData.push(...batchResults);
                }

                if (!signal.aborted) {
                    setResults(batchData);
                }
            } catch (error) {
                if (error.name !== "AbortError") {
                    setError(error.message);
                }
            } finally {
                if (!signal.aborted) {
                    setLoading(false);
                }
            }
        };

        runApiCalls();

        return () => {
            abortRef.current?.abort();
        };
    }, []); // Added dependencies

    return { loading, results, error };
}