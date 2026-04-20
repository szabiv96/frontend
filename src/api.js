export async function fetchJson(path, options = {}) {
  const response = await fetch(path, options);
  const contentType = response.headers.get('content-type') || '';

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const payload = await response.json();

      if (payload?.error) {
        message = payload.error;
      }
    } catch (error) {
      // Ignore invalid JSON error payloads and keep the generic message.
    }

    throw new Error(message);
  }

  if (!contentType.includes('application/json')) {
    throw new Error(
      'The local /api routes are not available. Start the project with `vercel dev` to run the secure server-side Sanity routes.'
    );
  }

  return response.json();
}
