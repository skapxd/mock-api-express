import { matchPath } from "../match-path";

export const findMockConfig = (req, mocks, fullUrl: string) => {
  return mocks.find((mock) => {
    if (mock.method !== req.method) return false;

    const params = matchPath(mock.path, fullUrl);

    if (Object.keys(params || {}).length !== 0) {
      req.params = { ...req.params, ...params };
      return true;
    }
    const endWith = req.path.endsWith(mock.path);
    return endWith;
  });
};
