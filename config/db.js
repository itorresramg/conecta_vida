const mysql = require('mysql2');
require('dotenv').config();

// Configuración de la conexión con la base de datos
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
};

const connection = mysql.createConnection(dbConfig);

// Probar la conexión
connection.connect((error) => {
  if (error) {
    console.error('Error al conectar con la base de datos:', error.message);
    return;
  }
  console.log('Conexión con MySQL establecida correctamente');
});

module.exports = connection;
