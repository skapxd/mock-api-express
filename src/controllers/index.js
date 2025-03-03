const matchPath = require('../helpers/match-path');
const getSource = require('../helpers/get-source');
const mocks = require('../../mock.json').mocks;

function mockController(req, res) {
  // Buscar el mock que coincida con el método y la ruta
  const mockConfig = mocks.find((mock) => {
    if (mock.method !== req.method) return false;
    // Intentar hacer match de la ruta, considerando parámetros
    const params = matchPath(mock.path, req.path);
    if (params) {
      req.params = { ...req.params, ...params };
      return true;
    }
    // Si no hay parámetros, se compara la ruta de forma exacta
    return mock.path === req.path;
  });

  if (!mockConfig) {
    return res
      .status(404)
      .json({ error: "No se encontró un mock para la ruta y método especificados" });
  }

  // Intentar encontrar una respuesta específica evaluando la condición "where"
  const specificResponse = mockConfig.responses.find((resp) => {
    if (!resp.where || !resp.in) return false;
    const source = getSource(resp.in, req);
    return Object.keys(resp.where).every(key => source[key] == resp.where[key]);
  });
  if (specificResponse) {
    return res.json(specificResponse.response);
  }

  // Si no hay respuesta específica, buscar la respuesta por defecto (sin "where")
  const defaultResponse = mockConfig.responses.find(resp => !resp.hasOwnProperty("where"));
  if (defaultResponse) {
    return res.json(defaultResponse.response);
  }

  // Si no se encontró ninguna respuesta adecuada, devolver error 404
  return res
    .status(404)
    .json({ error: "No se encontró una respuesta que coincida con la query" });
}

module.exports = mockController;