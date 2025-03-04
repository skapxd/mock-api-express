import "source-map-support/register";

import express from "express";
import path from "path";
import { mockController } from "./controllers";

export const app = express();
// Middleware para parsear el JSON del body
app.use(express.json());

// Servir archivos estáticos desde el directorio 'public'
app.use(express.static(path.join(__dirname, '../public')));

// Ruta específica para servir la página principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Se delega el resto de rutas al controlador de mocks (excepto las que empiezan con /public)
app.all("*", async (req, res, next) => {
  // Ignorar peticiones a archivos estáticos
  if (req.path.startsWith('/public') || req.path === '/' || req.path === '/mock.json') {
    return next();
  }
  
  try {
    await mockController(req, res);
  } catch (error) {
    next(error);
  }
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Algo salió mal!", error: err.message });
});

if (require.main === module) {
  app.listen(process.env.PORT || 3000, () =>
    console.log("Server ready on port 3000.")
  );
}

export default app;
