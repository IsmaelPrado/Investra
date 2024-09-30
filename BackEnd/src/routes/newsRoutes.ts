// src/routes/newsRoutes.ts

import { Router, Request, Response } from 'express';
import NewsAPI from 'newsapi';

const router = Router();
const newsapi = new NewsAPI('d37b7496f64e427caae753df270eeac9');

// Ruta para obtener noticias financieras
router.get('/financial-news', async (req: Request, res: Response) => {
  try {
    // Consultar la API de NewsAPI
    const response = await newsapi.v2.topHeadlines({
      category: 'business', // Se define la categoría de noticias financieras
      language: 'en', // Se define el idioma de las noticias
      country: 'us' // Se define la región de las noticias
    });

    // Verificar si se encontraron artículos
    if (response.status === 'ok' && response.articles.length > 0) {
      res.json({ articles: response.articles });
    } else {
      res.status(404).json({ message: 'No se encontraron artículos' });
    }
  } catch (error) {
    console.error('Error al obtener noticias:', error);
    res.status(500).json({ message: 'Error al obtener noticias financieras' });
  }
});

export default router;
