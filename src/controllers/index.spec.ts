// src/controllers/index.spec.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockController } from "./index";
import * as getJsonMockModule from "../helpers/get-json-mock";
import * as findMockConfigModule from "../helpers/find-mock-config";
import * as findResponseModule from "../helpers/find-response";

// Creamos mocks para las dependencias
vi.mock("../helpers/get-json-mock", () => ({
  getJsonMock: vi.fn(),
}));

vi.mock("../helpers/find-mock-config", () => ({
  findMockConfig: vi.fn(),
}));

vi.mock("../helpers/find-response", () => ({
  findResponse: vi.fn(),
}));

// Creamos mocks para request, response y next
function createMockReq(url = "/api/test") {
  return {
    protocol: "http",
    get: vi.fn(() => "localhost"),
    originalUrl: url,
    method: "GET",
    query: {},
    body: {},
    headers: {},
  } as any;
}

function createMockRes() {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

describe("mockController", () => {
  let req: ReturnType<typeof createMockReq>;
  let res: ReturnType<typeof createMockRes>;

  beforeEach(() => {
    req = createMockReq();
    res = createMockRes();

    // Reiniciamos las implementaciones de los mocks
    vi.clearAllMocks();
  });

  it("debe responder 404 si no se encuentra config para la ruta", async () => {
    // Configuramos el mock para que no encuentre config
    (getJsonMockModule.getJsonMock as any).mockResolvedValue({ mocks: [] });
    (findMockConfigModule.findMockConfig as any).mockReturnValue(undefined);

    await mockController(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "No se encontró un mock para la ruta y método especificados",
    });
  });

  it("debe responder 404 si no se encuentra una respuesta que coincida con la query", async () => {
    // Simulamos que se encuentra una config pero no hay respuesta coincidente
    const configFake = { responses: [] };
    (getJsonMockModule.getJsonMock as any).mockResolvedValue({
      mocks: [configFake],
    });
    (findMockConfigModule.findMockConfig as any).mockReturnValue(configFake);
    (findResponseModule.findResponse as any).mockReturnValue(undefined);

    await mockController(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "No se encontró una respuesta que coincida con la query",
    });
  });

  it("debe responder con el response correcto si se encuentra una respuesta coincidente", async () => {
    const mockResponseData = { data: "respuesta exitosa" };
    const configFake = { responses: [{ response: mockResponseData }] };

    (getJsonMockModule.getJsonMock as any).mockResolvedValue({
      mocks: [configFake],
    });
    (findMockConfigModule.findMockConfig as any).mockReturnValue(configFake);
    (findResponseModule.findResponse as any).mockReturnValue({
      response: mockResponseData,
    });

    await mockController(req, res);

    expect(res.json).toHaveBeenCalledWith(mockResponseData);
  });
});
