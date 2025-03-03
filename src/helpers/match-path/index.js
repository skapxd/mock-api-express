const { URLPattern } = require('urlpattern-polyfill')

function matchPath(mockPath, actualPath) {
  // Crear el patrón con la opción extendida
  const pattern = new URLPattern({ pathname: mockPath })
  const result = pattern.exec(actualPath);

  if (!result) return null;

  return result.pathname.groups || {};
}

module.exports = matchPath;