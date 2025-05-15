const db = require('../config/db');
const nodemailer = require('nodemailer');

// Configura aquí tu cuenta de correo
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER, 
    pass: process.env.MAIL_PASS  
  }
});

// Controlador para guardar mensajes de contacto y enviar correo
exports.sendMessage = (req, res) => {
  const { nombre, email, mensaje } = req.body;

  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ message: 'Por favor, rellena todos los campos' });
  }

  const consulta = 'INSERT INTO mensajes_contacto (nombre, email, mensaje) VALUES (?, ?, ?)';

  db.query(consulta, [nombre, email, mensaje], (error, resultado) => {
    if (error) {
      console.error('No se pudo guardar el mensaje:', error);
      return res.status(500).json({ message: 'Hubo un problema al enviar el mensaje' });
    }

    // Si guarda correctamente, ahora enviamos el correo
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: 'Nuevo mensaje desde Conecta Vida',
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; background-color: #f8f9fa; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <div style="background-color: #198754; color: white; padding: 15px 20px;">
              <h2 style="margin: 0; font-size: 24px;">Nuevo mensaje recibido</h2>
            </div>
            <div style="padding: 20px; color: #333;">
              <p><strong>Nombre:</strong> ${nombre}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Mensaje:</strong></p>
              <p style="background-color: #f1f1f1; padding: 10px; border-radius: 4px;">${mensaje}</p>
            </div>
            <div style="background-color: #f8f9fa; padding: 15px 20px; text-align: center; font-size: 12px; color: #666;">
              <p style="margin: 0;">Conecta Vida © 2025</p>
            </div>
          </div>
        </div>
      `
    };


    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error al enviar el correo:', err);
        return res.status(500).json({ message: 'Mensaje guardado, pero no se pudo enviar el correo.' });
      } else {
        console.log('Correo enviado:', info.response);
        return res.status(201).json({ message: 'Gracias por tu mensaje. Lo hemos recibido correctamente.' });
      }
    });
  });
};
