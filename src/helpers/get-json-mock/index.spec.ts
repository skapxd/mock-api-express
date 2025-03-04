import { getJsonMock } from "./index";
import { vi, describe, beforeEach, afterEach, it, expect } from "vitest";

describe("getJsonMock", () => {
  const urlBase = `http://localhost:3000/skapxd`;

  beforeEach(() => {
    // Reiniciamos el mock de fetch antes de cada test.
    global.fetch = vi.fn();
    // Espiamos console.error para verificar que se invoque en los casos de error.
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    // Restauramos los mocks.
    vi.restoreAllMocks();
  });

  it("debe retornar el JSON cuando fetch es exitoso con la rama master", async () => {
    const fakeData = { key: "value" };
    // Simulamos una respuesta exitosa de fetch.
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => fakeData,
    });

    const origin = `${urlBase}/bc-mocks-apis/videos/2`;
    const result = await getJsonMock(origin);

    expect(result).toEqual(fakeData);
    expect(global.fetch).toHaveBeenCalledWith(
      "https://raw.githubusercontent.com/skapxd/bc-mocks-apis/refs/heads/master/mock.json"
    );
  });

  it("debe intentar la rama main si master falla", async () => {
    const fakeData = { key: "value" };
    // La primera llamada (master) falla y la segunda (main) tiene éxito.
    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => fakeData,
      });

    const origin = `${urlBase}/bc-mocks-apis/videos/2`;
    const result = await getJsonMock(origin);

    expect(result).toEqual(fakeData);
    expect(global.fetch).toHaveBeenNthCalledWith(
      1,
      "https://raw.githubusercontent.com/skapxd/bc-mocks-apis/refs/heads/master/mock.json"
    );
    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      "https://raw.githubusercontent.com/skapxd/bc-mocks-apis/refs/heads/main/mock.json"
    );
  });

  it("debe lanzar un error cuando ninguna rama es exitosa", async () => {
    // Simulamos que ambas ramas fallan.
    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
    });

    const origin = `${urlBase}/bc-mocks-apis/videos/2`;

    await expect(getJsonMock(origin)).rejects.toThrow(
      "No se pudo descargar mock.json en ninguna de las ramas principales."
    );

    expect(global.fetch).toHaveBeenNthCalledWith(
      1,
      "https://raw.githubusercontent.com/skapxd/bc-mocks-apis/refs/heads/master/mock.json"
    );
    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      "https://raw.githubusercontent.com/skapxd/bc-mocks-apis/refs/heads/main/mock.json"
    );
  });
});
