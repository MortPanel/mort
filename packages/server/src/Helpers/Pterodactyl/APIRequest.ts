type APIResponse<T> = T & { errors?: any };

export default async function APIRequest<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
    body?: any,
    options?: RequestInit
): Promise<APIResponse<T>> {
    const response = await fetch(process.env.PTERODACTYL_PANEL_URL + "/api" + endpoint, {
        method,
        ...options,
        headers: {
            Accept: "application/vnd.pterodactyl.v1+json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.PTERODACTYL_API_KEY}`,
            ...options?.headers
        },
        body: body ? JSON.stringify(body) : undefined
    });
    if (response.status === 204) return {} as APIResponse<T>;
    return await response.json();
}