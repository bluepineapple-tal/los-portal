/**
 * Example "fetchApi" wrapper around the native fetch.
 *   - Attach your SuperTokens session headers
 *   - Send & receive JSON
 *   - Throw on HTTP error
 */
export async function fetchApi<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  // e.g., if you're using SuperTokens or another auth system,
  // you might need to attach certain headers or retrieve an access token.
  // For example:
  // const accessToken = await getSupertokensAccessTokenSomehow();
  // ... or your session library might automatically attach them.

  const mergedOptions: RequestInit = {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${accessToken}`, // If needed
      ...options.headers,
    },
    ...options,
  };

  // If there's a body object, serialize it to JSON
  if (options.body && typeof options.body !== "string") {
    mergedOptions.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, mergedOptions);

  if (!response.ok) {
    // Optionally parse the body to get error messages
    let errorMessage = `HTTP Error: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage += ` - ${errorData?.message || JSON.stringify(errorData)}`;
    } catch {
      // fall back to the default
    }
    throw new Error(errorMessage);
  }

  // If the response is JSON, parse it
  try {
    return (await response.json()) as T;
  } catch {
    // If there's no JSON to parse (e.g., 204 No Content), return null/undefined
    return undefined as T;
  }
}
