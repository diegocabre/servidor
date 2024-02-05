const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Client } = require("pg");

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configuración de la conexión a PostgreSQL
const pgClient = new Client({
  host: "localhost",
  user: "postgres",
  password: "123456",
  database: "likeme",
  allowExitOnIdle: true,
});
pgClient.connect();

// Ruta GET para obtener registros
app.get("/posts", async (req, res) => {
  try {
    const result = await pgClient.query("SELECT * FROM posts");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener registros:", error);
    res.status(500).json({ error: "Error al obtener registros" });
  }
});

// Ruta POST para almacenar nuevos registros
app.post("/posts", async (req, res) => {
  try {
    const { titulo, img, descripcion } = req.body;

    // Validar que los datos estén completos
    if (!titulo || !img || !descripcion) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }

    const result = await pgClient.query(
      "INSERT INTO likeme (titulo, img, descripcion) VALUES ($1, $2, $3) RETURNING *",
      [titulo, img, descripcion]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al almacenar el nuevo registro:", error);
    res.status(500).json({ error: "Error al almacenar el nuevo registro" });
  }
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
