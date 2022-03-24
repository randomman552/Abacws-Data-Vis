/**
 * Interface defining the structure of all API calls using the {@link apiFetch} function.
 */
export interface APIResponse<Body> {
    /**
     * Status code of the request
     */
    status: number
    /**
     * Whether the request was a success
     */
    success: boolean
    /**
     * Any JSON body that accompanied the response
     */
    body: Body
}

/**
 * Utility function to query the backend api
 * @param url URL to query
 * @param method Method to use (defaults to GET)
 * @param body JSON Body of the request (defaults to empty)
 * @returns 
 */
export async function apiFetch<Body=any>(url: string, method: string="GET", body: any=undefined): Promise<APIResponse<Body>> {
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
    let resBody = {} as Body;
    try {
        resBody = await res.json() as Body;
    } catch (e) { console.error(e); }

    // Put response into APIResponse form
    const json: APIResponse<Body> = {
        body: resBody,
        status: res.status,
        success: res.status >= 200 && res.status < 400
    }

    return json;
}