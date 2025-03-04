import { URLPattern } from "urlpattern-polyfill";

export function matchPath(mockPath: string, actualPath: string) {
  // Crear el patrón con la opción extendida

  const pathname = `/:github_user/:github_repo${mockPath}`;
  const pattern = new URLPattern({ pathname });
  const result = pattern.exec(actualPath);

  if (!result) return null;

  const { github_user, github_repo, ...params } = result.pathname.groups || {};
  return params;
}
