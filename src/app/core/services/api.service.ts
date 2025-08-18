import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

export interface Article {
  id: string;
  title: string;
  summary?: string;
  imageUrl?: string;
  url: string;
  publishedAt?: string;
  source?: string;
}
export interface ArticleDetail extends Article {
  contentHtml: string;
  authorName?: string;
  categories?: string[];
}

export interface Section {
  id: number;
  name: string;
  slug: string;
  count: number;
}
export interface Author {
  id: number;
  name: string;
  slug: string;
  count: number;
}



type WpEmbedded = {
  author?: Array<{ name?: string }>;
  ['wp:featuredmedia']?: Array<{ source_url?: string }>;
  ['wp:term']?: Array<Array<{ taxonomy?: string; name?: string }>>; // [ [categories], [tags] ]
};

type WpPost = {
  id: number;
  date: string;
  link: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content?: { rendered?: string };
  _embedded?: WpEmbedded;
};

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  // Mock API base (later swap for your real WordPress host)
  private base = 'http://localhost:4000/wp-json/wp/v2';

  /** Search posts by text (mock WP supports ?search=) */
  searchArticles(
    query = '',
    page = 1,
    perPage = 10,
    opts?: { authorId?: number; categoryId?: number }
  ) {
    const params = new URLSearchParams();
    if (query) params.set('search', query);
    params.set('per_page', String(perPage));
    params.set('page', String(page));
    params.set('_embed', '1');
    if (opts?.authorId) params.set('author', String(opts.authorId));
    if (opts?.categoryId) params.set('categories', String(opts.categoryId));

    const url = `${this.base}/posts?${params.toString()}`;
    return this.http
      .get<WpPost[]>(url)
      .pipe(map((list) => list.map((p) => this.toArticle(p))));
  }

  listArticles(page = 1, perPage = 10) {
    const url = `${this.base}/posts?per_page=${perPage}&page=${page}&_embed=1`;
    return this.http.get<WpPost[]>(url, { observe: 'response' }).pipe(
      map((resp) => {
        const posts = resp.body ?? [];
        return posts.map(this.toArticle);
      })
    );
  }

  getArticle(id: string | number) {
    const url = `${this.base}/posts/${id}?_embed=1`;
    return this.http.get<WpPost>(url).pipe(map((p) => this.toArticleDetail(p)));
  }

  searchAuthors(query: string, page = 1, perPage = 10) {
    const url = `/wp-json/wp/v2/users?search=${encodeURIComponent(
      query
    )}&per_page=${perPage}&page=${page}`;
    return this.http.get<Author[]>(url);
  }

  searchSections(query: string, page = 1, perPage = 10) {
    const url = `/wp-json/wp/v2/categories?search=${encodeURIComponent(
      query
    )}&per_page=${perPage}&page=${page}`;
    return this.http.get<Section[]>(url);
  }

  private clean(html?: string) {
    return (html || '').replace(/<[^>]+>/g, '').trim();
  }

  private imageFrom(p: WpPost) {
    return (
      p._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
      `https://picsum.photos/seed/${p.id}/1200/675`
    );
  }
  private toArticle(p: WpPost): Article {
    const clean = (html?: string) =>
      (html || '').replace(/<[^>]+>/g, '').trim();
    const image =
      p._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
      `https://picsum.photos/seed/${p.id}/800/450`;

    return {
      id: String(p.id),
      title: clean(p.title?.rendered),
      summary: clean(p.excerpt?.rendered),
      imageUrl: image,
      url: p.link,
      publishedAt: p.date,
      source: 'FitsNews',
    };
  }

  private toArticleDetail(p: WpPost): ArticleDetail {
    const cats = (p._embedded?.['wp:term']?.[0] || [])
      .filter((t) => t.taxonomy === 'category')
      .map((t) => t.name || '')
      .filter(Boolean);

    return {
      ...this.toArticle(p),
      authorName: p._embedded?.author?.[0]?.name || 'FitsNews',
      contentHtml: p.content?.rendered || '',
      categories: cats,
    };
  }
}
