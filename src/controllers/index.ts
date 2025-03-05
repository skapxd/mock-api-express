import { Request, Response } from "express";
import { findMockConfig } from "../helpers/find-mock-config";
import { findResponse } from "../helpers/find-response";
import { getJsonMock } from "../helpers/get-json-mock";

export async function mockController(req: Request, res: Response) {
  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  const json = await getJsonMock(fullUrl, req);
  // const json = require("../../mock.json");
  const config = findMockConfig(req, json.mocks, fullUrl);

  if (!config) {
    return res.status(404).json({
      error: "No se encontró un mock para la ruta y método especificados",
    });
  }

  const response = findResponse(config.responses, req);

  if (response != null && "status" in response && "response" in response) {
    return res.status(response.status).json(response.response);
  }

  if (response != null && "response" in response) {
    return res.json(response.response);
  }

  return res.status(404).json({
    error: "No se encontró una respuesta que coincida con la query",
  });
}
