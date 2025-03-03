const express = require("express");
const app = express();
const mockController = require('./controllers');

// Middleware para parsear el JSON del body
app.use(express.json());

// Se delega todas las rutas al controlador de mocks
app.all("*", mockController);

app.listen(process.env.PORT || 3000, () => console.log("Server ready on port 3000."));

module.exports = app;