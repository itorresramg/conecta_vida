const axios = require('axios');

// Función para obtener noticias recientes de salud mental
exports.getNews = async (req, res) => {
  try {
    const apiKey = process.env.NEWS_API_KEY;

    const response = await axios.get('https://gnews.io/api/v4/search', {
      params: {
        q: 'salud mental',
        lang: 'es',
        country: 'es',
        max: 10,
        token: apiKey
      }
    });

    res.status(200).json(response.data.articles);
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
    res.status(500).json({ message: 'No se pudieron cargar las noticias en este momento' });
  }
};