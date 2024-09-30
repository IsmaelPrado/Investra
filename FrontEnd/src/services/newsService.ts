// src/services/newsService.ts
const API_URL = 'http://localhost:3000/financial-news';

export const fetchFinancialNews = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Error al obtener las noticias');
  }
  const data = await response.json();
  return data.articles;
};
