export function unwrap<T>(response: { data: T | null }): T {
  if (response.data === null) {
    throw new Error(JSON.stringify(response));
  } else {
    return response.data;
  }
}
