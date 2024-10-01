// src/components/FinancialNews.tsx
import React, { useEffect, useState } from 'react';
import { fetchFinancialNews } from '../../services/newsService';

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fade, setFade] = useState(true);

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

  useEffect(() => {
    if (articles.length > 0) {
      const interval = setInterval(() => {
        setFade(false);
        setTimeout(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % articles.length);
          setFade(true);
        }, 500);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [articles]);

  if (loading) {
    return <div className="text-center text-lg text-gray-400">Cargando noticias...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center">{`Error: ${error}`}</div>;
  }

  const currentArticle = articles[currentIndex];

  return (
    <div className={`w-full transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
      {currentArticle && (
        <a href={currentArticle.url} target="_blank" rel="noopener noreferrer" className="block bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4 transition-all duration-1000 ease-in-out h-[400px] flex flex-col hover:bg-gray-700">
          <h2 className="text-lg font-semibold text-white hover:text-blue-400 transition-colors duration-200">
            {currentArticle.title}
          </h2>
          <p className="text-gray-400 mt-1">
            <strong>Fuente:</strong> {currentArticle.source.name}
          </p>
          {currentArticle.urlToImage && (
            <div className="flex-grow flex items-center justify-center">
              <img
                src={currentArticle.urlToImage}
                alt={currentArticle.title}
                className="w-full h-20 object-cover rounded-md mt-2 mb-2"
              />
            </div>
          )}
          <span className="inline-block mt-3 text-blue-400 hover:text-blue-600 font-bold">
            Leer más
          </span>
        </a>
      )}
    </div>
  );
};

export default FinancialNews;
