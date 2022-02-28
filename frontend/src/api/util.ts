/**
 * Utility function to query the backend api
 * @param url URL to query
 * @param body JSON Body of the request (defaults to empty)
 * @param method Method to use (defaults to post)
 * @returns 
 */
export async function apiFetch(url: string, body={}, method="POST") {
    const options = {
        method: method,
        body: JSON.stringify(body),
        headers: {
            "Accept": "application/json"
        }
    }

    const res = await fetch(url, options);
    const json = await res.json();

    // Add some convinience attributes
    json.status = res.status;
    json.success = json.status >= 200 && json.status < 400;

    return json;
}