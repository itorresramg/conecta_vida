const db = require('../config/db');
const bcrypt = require('bcrypt');

// Función para registrar nuevos usuarios
exports.register = (req, res) => {
  const { nombre, email, password } = req.body;

  // Verificamos que no falte ningún dato
  if (!nombre || !email || !password) {
    return res.status(400).json({ message: 'Por favor, completa todos los campos' });
  }

  const passwordEncriptada = bcrypt.hashSync(password, 10);

  const query = 'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)';
  db.query(query, [nombre, email, passwordEncriptada], (error, resultado) => {
    if (error) {
      console.error('No se pudo registrar el usuario:', error);
      return res.status(500).json({ message: 'Ocurrió un error durante el registro' });
    }

    res.status(201).json({ message: 'Usuario creado con éxito' });
  });
};

// Función para iniciar sesión
exports.login = (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM usuarios WHERE email = ?';
  db.query(query, [email], (error, resultados) => {
    if (error) {
      console.error('Error al consultar usuario:', error);
      return res.status(500).json({ message: 'No se pudo procesar la solicitud' });
    }

    if (resultados.length === 0) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    const usuario = resultados[0];
    const coincide = bcrypt.compareSync(password, usuario.password);

    if (!coincide) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email
      }
    });
  });
};
