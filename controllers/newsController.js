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
        pageSize: 10
      },
      headers: {
        'X-Api-Key': apiKey
      }
    });

    res.status(200).json(resultado.data.articles);
  } catch (err) {
    console.error('❌ Error completo en /api/news:');
    if (err.response) {
      console.error('🧾 Código:', err.response.status);
      console.error('📩 Data:', err.response.data);
    } else if (err.request) {
      console.error('🌐 Error de red o sin respuesta:', err.request);
    } else {
      console.error('❗ Error general:', err.message);
    }
    res.status(500).json({ message: 'No se pudieron cargar las noticias en este momento' })
  }
};
