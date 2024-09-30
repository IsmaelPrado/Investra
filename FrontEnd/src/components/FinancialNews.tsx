// src/components/FinancialNews.tsx
import React, { useEffect, useState } from 'react';
import { fetchFinancialNews } from '../services/newsService';

interface Article {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string | null;
}

const FinancialNews: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const articles = await fetchFinancialNews();
        setArticles(articles);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return <div className="text-center text-lg text-gray-400">Cargando noticias...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center">{`Error: ${error}`}</div>;
  }

  return (
    <div className="w-full ">
      <h1 className="text-3xl font-bold text-center text-white mb-8">Noticias Financieras</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-3 gap-4">
        {articles.map((article, index) => (
          <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-4 transition-transform transform hover:scale-105 w-full">
            <h2 className="text-lg font-semibold text-white hover:text-blue-400 transition-colors duration-200">{article.title}</h2>
            <p className="text-gray-400 mt-1">
              <strong>Fuente:</strong> {article.source.name}
            </p>
            <p className="text-gray-400">
              <strong>Autor:</strong> {article.author || 'Desconocido'}
            </p>
            <p className="text-gray-300 my-2">{article.description}</p>
            {article.urlToImage && (
              <img
                src={article.urlToImage}
                alt={article.title}
                className="w-full h-auto rounded-md mt-2 mb-2"
              />
            )}
            <p className="text-gray-500 text-sm mb-2">
              <strong>Publicado el:</strong> {new Date(article.publishedAt).toLocaleDateString()}
            </p>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-blue-400 hover:text-blue-600 font-bold"
            >
              Leer más
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinancialNews;
