export const parseResult = async <ResponseData>(
  response: Response,
): Promise<ResponseData | null> => {
    if (!response) {
      throw new Error("invalid response");
    }

    const contentType = response.headers.get("Content-type");

    let data: ResponseData | null = null;
    if (!contentType) {
      return data;
    }

    if (contentType.includes("application/json")) {
      data = await response.json();
      return data;
    }

    if (contentType.includes("text/plain")) {
      data = (await response.text()) as ResponseData;
      return data;
    }

    // я рассмотрела базовые случаи. остальные типа blob, стрим или еще что надо посмотреть в документации.
    // И тогда я бы, наверное, это вынесла в switch и даже в отдельный метод-парсер. Но пока что пусть будет так.
    return data;
  
};

export async function fetchWithRetries(
  retriesCount: number = 0,
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  let error: unknown;

  do {
    try {
      const response = await fetch(input, init);

      if (!response.ok) {
        throw new Error(
          `Response fetched with error. Status: ${response.status}`,
        );
      }

      return response;
    } catch (e) {
      error = e;
      retriesCount -= 1;
    }
  } while (retriesCount >= 0);

  throw error;
}
