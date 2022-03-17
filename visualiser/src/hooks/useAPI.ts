import { useEffect, useState } from "react";
import { apiFetch, APIResponse } from "../api";

/**
 * React hook to send an API request to the given URL
 * Returns the response sent by the API once the request is completed
 * @param url The URL to send a request to
 */
export function useAPI<Body=any>(url: string) {
    const [response, setResponse] = useState<APIResponse<Body>>();

    useEffect(() => {
        apiFetch<Body>(url).then((res) => {
            setResponse(res);
        });
    }, [url]);

    return response;
}

/**
 * React hook to subscribe to an API request to the given URL.
 * Refreshes the result every 10 seconds by default
 * @param url The URL to query
 * @param interval The interval (in ms) to refresh the results after (default 10000)
 * @returns The results
 */
export function useAPISubscription<Body=any>(url: string, interval: number=10000) {
    const [response, setResponse] = useState<APIResponse<Body>>();
    
    // Set interval to regularly refresh the response value
    useEffect(() => {
        // Function to be used to query API
        const fetchFunc = () => {
            apiFetch<Body>(url).then((res) => {
                setResponse(res);
            });
        };

        const intervalID = setInterval(() => {
            fetchFunc()
        }, interval)
        fetchFunc();

        // Cleanup function to remove interval
        return () => { clearInterval(intervalID) };
    }, [url, interval]);

    return response;
}
