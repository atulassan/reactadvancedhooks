import { useEffect, useState, useRef } from "react";

export function useChainFetch(steps = []) {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const abortRef = useRef(null);

  useEffect(() => {
    const start = async () => {
      const controller = new AbortController();
      abortRef.current = controller;
      const signal = controller.signal;
      
      setLoading(true); // Set loading at the start of each execution

      try {
        let previous = null;
        let output = [];

        for (const step of steps) {
          const url = typeof step === "function" ? step(previous) : step;
            
          const response = await fetch(url, { signal });
          if (!response.ok) throw new Error("API failed: " + url);

          const json = await response.json();

          output.push(json);
          previous = json;
        }

        if (!signal.aborted) { // Only update if not aborted
          setResults(output);
        }

      } catch (err) {
        if (err.name !== "AbortError") {
          console.log("Error:", err);
        }
      } finally {
        if (!signal.aborted) { // Only set loading false if not aborted
          setLoading(false);
        }
      }
    };

    start();

    return () => {
      abortRef.current?.abort();
    };
  }, []);

  return { loading, results };
}