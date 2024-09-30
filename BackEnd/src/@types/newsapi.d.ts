// src/@types/newsapi.d.ts

declare module 'newsapi' {
  export interface Article {
    author: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    content: string;
  }

  export interface NewsAPIResponse {
    status: string;
    articles: Article[];
  }

  export default class NewsAPI {
    constructor(apiKey: string);
    v2: {
      sources: any;
      topHeadlines: (options: {
        category?: string;
        language?: string;
        country?: string;
        q?: string;
        sources?: string;
      }) => Promise<NewsAPIResponse>;

      everything: (options: {
        q?: string;
        sources?: string;
        domains?: string;
        from?: string;
        to?: string;
        language?: string;
        sortBy?: string;
        page?: number;
      }) => Promise<NewsAPIResponse>;
    };
  }
}
