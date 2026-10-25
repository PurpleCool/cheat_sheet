export type JsonResponse = {
  key?: string;
  key2?: string;
};

export type GetJson = (resource: "one" | "two") => Promise<JsonResponse>;
export type LogError = (error: unknown) => void;

export function promiseFunction(
  getJson: GetJson,
  logError: LogError = console.log,
) {
  return getJson("one")
    .then((x) => {
      if (!x.key) throw Error("No key");
      return getJson("two");
    })
    .then((x) => x.key2)
    .catch(logError);
}

export async function asyncFunction(
  getJson: GetJson,
  logError: LogError = console.log,
) {
  try {
    const x = await getJson("one");
    if (!x.key) {
      throw Error("No key");
    }

    const x2 = await getJson("two");
    return x2.key2;
  } catch (e) {
    logError(e);
  }
}
