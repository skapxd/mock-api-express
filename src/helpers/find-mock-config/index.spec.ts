// src/helpers/find-mock-config/index.spec.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { findMockConfig } from ".";

// Mockeamos matchPath que se usa en la función
vi.mock("#/src/helpers/match-path", () => ({
  matchPath: vi.fn(),
}));
import { matchPath } from "#/src/helpers/match-path";

describe("findMockConfig", () => {
  beforeEach(() => {
    // Reiniciamos mocks antes de cada test
    vi.resetAllMocks();
  });

  it("debe retornar undefined si ningún mock coincide con el método", () => {
    const req = { method: "GET", path: "/user", params: {} };
    const mocks = [{ method: "POST", path: "/user" }];
    // Para este caso, matchPath no debe devolver parámetros
    (matchPath as any).mockReturnValue(null);

    const result = findMockConfig(req, mocks, "");
    expect(result).toBeUndefined();
  });

  it("debe retornar el mock cuando la ruta coincide exactamente (sin parámetros)", () => {
    const req = { method: "GET", path: "/user", params: {} };
    const mockConfig = { method: "GET", path: "/user" };
    const mocks = [mockConfig];
    (matchPath as any).mockReturnValue(null);

    const result = findMockConfig(req, mocks, "");
    expect(result).toBe(mockConfig);
    expect(req.params).toEqual({});
  });

  it("debe retornar el mock cuando matchPath devuelve parámetros y actualizar req.params", () => {
    const req = { method: "GET", path: "/user/123", params: {} };
    const mockConfig = { method: "GET", path: "/user/:id" };
    const mocks = [mockConfig];
    // Simulamos que matchPath devuelve un objeto de parámetros
    (matchPath as any).mockReturnValue({ id: "123" });

    const result = findMockConfig(req, mocks, "");
    expect(result).toBe(mockConfig);
    expect(req.params).toEqual({ id: "123" });
  });

  it("debe retornar el primer mock que coincida entre varios mocks", () => {
    const req = { method: "GET", path: "/user/123", params: {} };
    const mock1 = { method: "GET", path: "/user" }; // No coincide: la ruta no es igual
    const mock2 = { method: "GET", path: "/user/:id" };
    const mocks = [mock1, mock2];

    // Para el primer mock, matchPath retorna null (no coincide)
    // Para el segundo mock, retorna un objeto de parámetros
    (matchPath as any)
      .mockImplementationOnce(() => null)
      .mockImplementationOnce(() => ({ id: "123" }));

    const result = findMockConfig(req, mocks, "");
    expect(result).toBe(mock2);
    expect(req.params).toEqual({ id: "123" });
  });

  it("debe fusionar los parámetros existentes de req.params con los nuevos parámetros", () => {
    const req = { method: "GET", path: "/user/123", params: { token: "abc" } };
    const mockConfig = { method: "GET", path: "/user/:id" };
    const mocks = [mockConfig];
    (matchPath as any).mockReturnValue({ id: "123" });

    const result = findMockConfig(req, mocks, "");
    expect(result).toBe(mockConfig);
    expect(req.params).toEqual({ token: "abc", id: "123" });
  });
});
