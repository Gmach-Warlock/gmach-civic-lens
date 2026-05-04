export async function fetchFromUrl<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const defaultHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || data.message || `HTTP error! status: ${response.status}`,
    );
  }
  console.log(data);
  return data as T;
}
