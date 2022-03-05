/**
 * Utility function to query the backend api
 * @param url URL to query
 * @param method Method to use (defaults to GET)
 * @param body JSON Body of the request (defaults to empty)
 * @returns 
 */
export async function apiFetch(url: string, method="GET", body=undefined) {
    const options: RequestInit = {
        method: method,
        headers: {
            "Accept": "application/json"
        }
    }

    // Set body if it has been provided and we arent making a GET or HEAD request
    if (body)
        if (method !== "GET" && method !== "HEAD")
            options.body = JSON.stringify(body);

    // Dispatch request
    const res = await fetch(url, options);
    const json = await res.json();

    // Add some convinience attributes
    json.status = res.status;
    json.success = json.status >= 200 && json.status < 400;

    return json;
}