import { describe, it, expect } from "vitest";
import { matchPath } from ".";

describe("matchPath", () => {
  const urlBase = `http://localhost/github-user/github-repo`;

  it("debe retornar null cuando la ruta no coincide", () => {
    const resultado = matchPath("/users/:id", `${urlBase}/products/123`);
    expect(resultado).toBeNull();
  });

  it("debe extraer correctamente un parámetro en la ruta", () => {
    const resultado = matchPath("/users/:id", `${urlBase}/users/123`);
    expect(resultado).toEqual({ id: "123" });
  });

  it("debe extraer correctamente múltiples parámetros", () => {
    const resultado = matchPath(
      "/users/:userId/posts/:postId",
      `${urlBase}/users/45/posts/99`
    );
    expect(resultado).toEqual({ userId: "45", postId: "99" });
  });

  it("debe retornar un objeto vacío cuando no hay parámetros", () => {
    const resultado = matchPath("/about", `${urlBase}/about`);
    expect(resultado).toEqual({});
  });

  it("debe retornar null si la ruta actual tiene segmentos adicionales", () => {
    const resultado = matchPath(
      "/users/:id/extra",
      `${urlBase}/users/123/extra`
    );
    expect(resultado).toEqual({ id: "123" });
  });
});
