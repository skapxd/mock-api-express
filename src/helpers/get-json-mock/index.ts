import { URLPattern } from "urlpattern-polyfill";

export async function getJsonMock(origin: string): Promise<any> {
  const pattern = new URLPattern({
    pathname: "/:github_user/:github_repo/:other*",
  });

  const patternResult = pattern.exec(origin);
  const { github_user, github_repo } = patternResult?.pathname?.groups ?? {};

  // Si se provee una rama en la URL, se usa esa; de lo contrario, se intentan las ramas principales.
  const branchesToTry = ["master", "main"];

  for (const branch of branchesToTry) {
    const url = `https://raw.githubusercontent.com/${github_user}/${github_repo}/refs/heads/${branch}/mock.json`;

    try {
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error(`Error al intentar la rama ${branch}:`, error);
    }
  }

  throw new Error(
    "No se pudo descargar mock.json en ninguna de las ramas principales."
  );
}
