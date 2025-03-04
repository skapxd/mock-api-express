import { describe, it, expect } from "vitest";
import { getSource } from ".";

describe("getSource", () => {
  it('debe retornar req.body cuando inValue es "body"', () => {
    const req = { body: { key: "value" } };
    const result = getSource("body", req);
    expect(result).toEqual({ key: "value" });
  });

  it('debe retornar req.query cuando inValue es "query"', () => {
    const req = { query: { key: "value" } };
    const result = getSource("query", req);
    expect(result).toEqual({ key: "value" });
  });

  it('debe retornar req.params cuando inValue es "param"', () => {
    const req = { params: { key: "value" } };
    const result = getSource("param", req);
    expect(result).toEqual({ key: "value" });
  });

  it("debe retornar un objeto vacío si inValue no coincide", () => {
    const req = {
      body: { key: "value" },
      query: { key: "value" },
      params: { key: "value" },
    };
    const result = getSource("invalid", req);
    expect(result).toEqual({});
  });
});
