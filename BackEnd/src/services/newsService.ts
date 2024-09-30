import NewsAPI from 'newsapi';
const newsapi = new NewsAPI('d37b7496f64e427caae753df270eeac9');

// Ejemplo de consulta de artículos:
newsapi.v2.topHeadlines({
  sources: 'associated-press',
}).then((articlesResponse: any) => {
  console.log(articlesResponse);
});

// Ejemplo de consulta de fuentes:
newsapi.v2.sources({
  category: 'technology',
  language: 'en',
  country: 'us'
}).then((sourcesResponse: any) => {
  console.log(sourcesResponse);
});
