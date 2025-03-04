import { matchPath } from "../match-path";

export const findMockConfig = (req, mocks, fullUrl: string) => {
  return mocks.find((mock) => {
    if (mock.method !== req.method) return false;

    const params = matchPath(mock.path, fullUrl);

    if (params) {
      req.params = { ...req.params, ...params };
      return true;
    }
    return mock.path === req.path;
  });
};
