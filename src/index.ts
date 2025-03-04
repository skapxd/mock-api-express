import "source-map-support/register";

import express from "express";
import { mockController } from "./controllers";

export const app = express();
// Middleware para parsear el JSON del body
app.use(express.json());

// Se delega todas las rutas al controlador de mocks
app.all("*", async (req, res, next) => {
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
