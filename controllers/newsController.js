const axios = require('axios');

// Función para obtener noticias recientes de salud mental
exports.getNews = async (req, res) => {
  try {
    const apiKey = process.env.NEWS_API_KEY;

    // Hoy en formato ISO (ej: 2025-04-24)
    const hoy = new Date().toISOString().split('T')[0];

    // Hace 3 días
    const haceTresDias = new Date();
    haceTresDias.setDate(haceTresDias.getDate() - 3);
    const desde = haceTresDias.toISOString().split('T')[0];

    const resultado = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'salud mental',
        from: desde,
        to: hoy,
        sortBy: 'publishedAt', // Ordenadas por fecha de publicación
        language: 'es',
        pageSize: 10,
        apiKey: apiKey
      }
    });

    res.status(200).json(resultado.data.articles);
  } catch (err) {
    console.error('Hubo un problema al recuperar las noticias:', err.message);
    res.status(500).json({ message: 'No se pudieron cargar las noticias en este momento' });
  }
};
