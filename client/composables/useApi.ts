type QueryValue = string | number | boolean | null | undefined;

interface RequestOptions extends Omit<RequestInit, 'body'> {
  query?: Record<string, QueryValue>;
  body?: unknown;
}

interface ApiErrorPayload {
  message?: string;
  error?: string;
}

export const useApi = () => {
  const config = useRuntimeConfig();
  const { token } = useAuth();

  const buildUrl = (
    endpoint: string,
    query?: Record<string, QueryValue>
  ): string => {
    const url = new URL(`${config.public.apiBase}${endpoint}`);

    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.append(key, String(value));
        }
      }
    }

    return url.toString();
  };

  const request = async <T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> => {
    const { query, body, headers: customHeaders, ...rest } = options;

    const isFormData = body instanceof FormData;
    const hasBody = body !== undefined;

    const headers: HeadersInit = {
      ...(token.value ? { Authorization: token.value } : {}),
      ...(!isFormData && hasBody ? { 'Content-Type': 'application/json' } : {}),
      ...(customHeaders || {}),
    };

    const response = await fetch(buildUrl(endpoint, query), {
      ...rest,
      headers,
      body: hasBody ? (isFormData ? body : JSON.stringify(body)) : undefined,
    });

    let data: T | ApiErrorPayload | null = null;

    const contentType = response.headers.get('content-type') || '';

    try {
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = null;
      }
    } catch {
      data = null;
    }

    if (!response.ok) {
      const errorMessage =
        (data as ApiErrorPayload | null)?.message ||
        (data as ApiErrorPayload | null)?.error ||
        `Request failed: ${response.status}`;

      if (response.status === 401) {
        // burada ileride logout veya login sayfasına yönlendirme eklenebilir
      }

      throw new Error(errorMessage);
    }

    return data as T;
  };

  const get = <T>(
    endpoint: string,
    options: Omit<RequestOptions, 'body'> = {}
  ) => request<T>(endpoint, { ...options, method: 'GET' });

  const post = <T>(
    endpoint: string,
    body?: unknown,
    options: Omit<RequestOptions, 'body'> = {}
  ) => request<T>(endpoint, { ...options, method: 'POST', body });

  const put = <T>(
    endpoint: string,
    body?: unknown,
    options: Omit<RequestOptions, 'body'> = {}
  ) => request<T>(endpoint, { ...options, method: 'PUT', body });

  const del = <T>(
    endpoint: string,
    options: Omit<RequestOptions, 'body'> = {}
  ) => request<T>(endpoint, { ...options, method: 'DELETE' });

  return {
    request,
    get,
    post,
    put,
    del,
  };
};
