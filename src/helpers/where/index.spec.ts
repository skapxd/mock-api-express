// index.spec.ts
import { describe, it, expect, beforeEach, vi, Mock } from "vitest";
import evaluateWhereCondition from ".";
import getSource from "../get-source";

// Creamos un alias para acceder fácilmente al mock de getSource.
// const mockedGetSource = getSource as unknown as { default: Mock };

// Mockeamos el módulo '../get-source' para interceptar sus llamadas.
vi.mock("../get-source");
const mockedGetSource = getSource as unknown as Mock;

describe("evaluateWhereCondition", () => {
  beforeEach(() => {
    // Reseteamos los mocks antes de cada test.
    vi.clearAllMocks();
    vi.resetAllMocks()
  });

  it('debería retornar false si "where" es falsy', () => {
    const result = evaluateWhereCondition(null, "algúnValor", {});
    expect(result).toBe(false);
  });

  it('debería retornar false si "inValue" es falsy', () => {
    const result = evaluateWhereCondition({ key: "valor" }, null, {});
    expect(result).toBe(false);
  });

  it('debería retornar true si "where" es un objeto vacío', async () => {
    // Aunque "where" esté vacío, every() retorna true.

    mockedGetSource.mockReturnValue({ anyKey: "anyValue" });
    const result = evaluateWhereCondition({}, "algúnValor", {});
    expect(result).toBe(true);
  });

  it("debería retornar true cuando todas las condiciones se cumplen", async () => {
    const sourceObject = { a: 1, b: "test" };
    mockedGetSource.mockReturnValue(sourceObject);
    const where = { a: 1, b: "test" };
    const result = evaluateWhereCondition(where, "algúnValor", {});
    expect(result).toBe(true);
  });

  it("debería retornar false cuando alguna condición no se cumple", async () => {
    const sourceObject = { a: 1, b: "test" };
    mockedGetSource.mockReturnValue(sourceObject);
    const where = { a: 2, b: "test" }; // La condición "a" no coincide.
    const result = evaluateWhereCondition(where, "algúnValor", {});
    expect(result).toBe(false);
  });

  it("debería usar la comparación laxa (==) para evaluar la condición", async () => {
    const sourceObject = { a: "1" };
    mockedGetSource.mockReturnValue(sourceObject);
    const where = { a: 1 }; // 1 == '1' es true.
    const result = evaluateWhereCondition(where, "algúnValor", {});
    expect(result).toBe(true);
  });

  it("debería llamar a getSource con los parámetros correctos", async () => {
    const inValue = "inValue";
    const req = { headers: {} };
    const sourceObject = { key: "valor" };
    mockedGetSource.mockReturnValue(sourceObject);
    const where = { key: "valor" };

    evaluateWhereCondition(where, inValue, req);
    expect(mockedGetSource).toHaveBeenCalledWith(inValue, req);
  });
});
