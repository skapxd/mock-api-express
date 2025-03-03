const express = require("express");
const app = express();

// Middleware para parsear el JSON del body
app.use(express.json());

const mocks = require('./mock.json').mocks;

app.all("*", (req, res) => {
  // Función auxiliar para comparar rutas que pueden tener parámetros (por ejemplo, "/videos/{id}")
  function matchPath(mockPath, actualPath) {
    const paramRegex = /{([^}]+)}/g;
    // Se reemplazan los tokens {param} por un grupo de captura que coincide con cualquier cadena que no contenga "/"
    const regexString = "^" + mockPath.replace(paramRegex, "([^/]+)") + "$";
    const regex = new RegExp(regexString);
    const match = regex.exec(actualPath);
    if (!match) return null;

    // Se obtienen los nombres de los parámetros en el mock
    const paramNames = [];
    let m;
    while ((m = paramRegex.exec(mockPath)) !== null) {
      paramNames.push(m[1]);
    }

    // Se asigna cada valor capturado al nombre del parámetro correspondiente
    const params = {};
    paramNames.forEach((name, index) => {
      params[name] = match[index + 1];
    });
    return params;
  }

  // Buscar el mock que coincida con el método y la ruta
  const mockConfig = mocks.find((mock) => {
    if (mock.method !== req.method) return false;
    // Intentar hacer match de la ruta, considerando parámetros
    const params = matchPath(mock.path, req.path);
    if (params) {
      // Se incorporan los parámetros extraídos a req.params
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

  // Función auxiliar para seleccionar la fuente de datos según la propiedad "in"
  function getSource(inValue) {
    switch (inValue) {
      case "body":
        return req.body;
      case "query":
        return req.query;
      case "param":
        return req.params;
      default:
        return {};
    }
  }

  // Intentar encontrar una respuesta específica evaluando la condición "where"
  const specificResponse = mockConfig.responses.find((resp) => {
    if (!resp.where || !resp.in) return false;
    const source = getSource(resp.in);
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
});

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;