export function unwrap<T>(response: { data: T | null }): T {
  if (response.data === null) {
    throw response;
  } else {
    return response.data;
  }
}
