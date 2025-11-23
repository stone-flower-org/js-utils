// TODO: write unit tests
export const parseJSONSafe = (json: string, def: unknown = null) => {
  try {
    return JSON.parse(json);
  } catch (_) {
    return def;
  }
};

export const beautifyJSONSafe = (json: string, space = 2) => {
  try {
    json = JSON.stringify(JSON.parse(json), undefined, space);
  } catch (_) {
    //
  }
  return json;
};

export const getJSONErrorMessage = (json: string) => {
  try {
    JSON.parse(json);
    return null;
  } catch (e) {
    return (e as Error).message;
  }
};

export const isValidJSON = (json: string) => !!getJSONErrorMessage(json);
