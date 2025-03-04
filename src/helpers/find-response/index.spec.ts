// src/helpers/find-response/index.spec.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { findResponse } from "./index";

// Mockeamos getSource para controlar su retorno en los tests
vi.mock("../get-source", () => ({
  getSource: vi.fn(),
}));
import { getSource } from "../get-source";

describe("findResponse", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('debe retornar la respuesta específica si se cumple la condición "where"', () => {
    const req = { someProp: "test" };
    const responseSpecific = {
      where: { id: 123 },
      in: "sourceA",
    };
    const responseDefault = {
      in: "sourceDefault",
    };
    const responses = [responseSpecific, responseDefault];
    // Simulamos que getSource devuelve un objeto que cumple con la condición
    (getSource as any).mockReturnValue({ id: 123 });

    const result = findResponse(responses, req);
    expect(result).toBe(responseSpecific);
    expect(getSource).toHaveBeenCalledWith("sourceA", req);
  });

  it('debe retornar la respuesta por defecto si no se cumple la condición "where"', () => {
    const req = { someProp: "test" };
    const responseSpecific = {
      where: { id: 123 },
      in: "sourceA",
    };
    const responseDefault = {
      in: "sourceDefault",
    };
    const responses = [responseSpecific, responseDefault];
    // Simulamos que getSource devuelve un objeto que NO cumple con la condición
    (getSource as any).mockReturnValue({ id: 456 });

    const result = findResponse(responses, req);
    expect(result).toBe(responseDefault);
    expect(getSource).toHaveBeenCalledWith("sourceA", req);
  });

  it("debe retornar undefined si no hay respuestas en el array", () => {
    const req = { someProp: "test" };
    const responses: any[] = [];
    const result = findResponse(responses, req);
    expect(result).toBeUndefined();
  });

  it('debe retornar la primera respuesta sin "where" si existen varias', () => {
    const req = { someProp: "test" };
    const responseDefault1 = { in: "source1" };
    const responseDefault2 = { in: "source2" };
    const responses = [responseDefault1, responseDefault2];
    const result = findResponse(responses, req);
    expect(result).toBe(responseDefault1);
  });

  it('debe evaluar múltiples claves en "where" y retornar la respuesta si todas coinciden', () => {
    const req = { someProp: "test" };
    const responseSpecific = {
      where: { id: 123, type: "user" },
      in: "sourceA",
    };
    const responses = [responseSpecific];
    // Simulamos que getSource devuelve un objeto con ambas claves que coinciden
    (getSource as any).mockReturnValue({ id: 123, type: "user" });

    const result = findResponse(responses, req);
    expect(result).toBe(responseSpecific);
    expect(getSource).toHaveBeenCalledWith("sourceA", req);
  });

  it('debe retornar la respuesta por defecto si alguna clave en "where" no coincide', () => {
    const req = { someProp: "test" };
    const responseSpecific = {
      where: { id: 123, type: "user" },
      in: "sourceA",
    };
    const responseDefault = {
      in: "sourceDefault",
    };
    const responses = [responseSpecific, responseDefault];
    // Simulamos que getSource devuelve un objeto en el que la clave "type" no coincide
    (getSource as any).mockReturnValue({ id: 123, type: "admin" });

    const result = findResponse(responses, req);
    expect(result).toBe(responseDefault);
  });

  it("abc", () => {
    
  });
});
