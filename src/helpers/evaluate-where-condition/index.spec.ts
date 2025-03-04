import { describe, it, expect, vi, beforeEach } from "vitest";
import { evaluateWhereCondition } from "./index";

// Simulamos el módulo que provee getSource
vi.mock("../get-source", () => ({
  getSource: vi.fn(),
}));

// Importamos la función mockeada para poder ajustar sus retornos en cada test
import { getSource } from "../get-source";

describe("evaluateWhereCondition", () => {
  beforeEach(() => {
    // Reiniciamos la simulación antes de cada test
    vi.clearAllMocks();
  });

  it('debe retornar false si "where" es falsy', () => {
    const result1 = evaluateWhereCondition(null, { a: 1 }, {});
    const result2 = evaluateWhereCondition(undefined, { a: 1 }, {});
    expect(result1).toBe(false);
    expect(result2).toBe(false);
  });

  it('debe retornar false si "inValue" es falsy', () => {
    const result1 = evaluateWhereCondition({ a: 1 }, null, {});
    const result2 = evaluateWhereCondition({ a: 1 }, undefined, {});
    expect(result1).toBe(false);
    expect(result2).toBe(false);
  });

  it('debe retornar true si "where" es un objeto vacío', () => {
    const result = evaluateWhereCondition({}, { a: 1 }, {});
    expect(result).toBe(true);
  });

  it('debe retornar true cuando los valores de "where" coinciden con la fuente obtenida', () => {
    // Simulamos que getSource retorna un objeto que cumple la condición
    const req = {};
    (getSource as any).mockReturnValue({ a: 1, b: 2 });

    const result = evaluateWhereCondition({ a: 1 }, "valorIndiferente", req);
    expect(result).toBe(true);
    expect(getSource).toHaveBeenCalledWith("valorIndiferente", req);
  });

  it('debe retornar false cuando al menos un valor de "where" no coincide', () => {
    // Simulamos que getSource retorna un objeto que no cumple la condición
    const req = {};
    (getSource as any).mockReturnValue({ a: 2, b: 2 });

    const result = evaluateWhereCondition({ a: 1 }, "valorIndiferente", req);
    expect(result).toBe(false);
  });

  it('debe evaluar correctamente múltiples propiedades en "where"', () => {
    const req = {};
    (getSource as any).mockReturnValue({ a: 1, b: 2, c: 3 });

    // Caso en que todas las propiedades coinciden
    const resultOk = evaluateWhereCondition(
      { a: 1, b: 2 },
      "valorIndiferente",
      req
    );
    expect(resultOk).toBe(true);

    // Caso en que una propiedad no coincide
    const resultFail = evaluateWhereCondition(
      { a: 1, b: 5 },
      "valorIndiferente",
      req
    );
    expect(resultFail).toBe(false);
  });

  it("debe procesar propiedades anidadas utilizando notación de punto", () => {
    const req = {};
    // Configuramos getSource para retornar un objeto anidado
    (getSource as any).mockReturnValue({ user: { group: { id: 1 } } });

    // Usamos una condición where con notación de punto
    const result = evaluateWhereCondition(
      { "user.group.id": 1 },
      "valorIndiferente",
      req
    );

    // Debido a la implementación actual, source["user.id"] es undefined.
    // Por ello, esperamos que retorne false, lo que indica que actualmente no se soporta.
    expect(result).toBe(true);
  });
});
