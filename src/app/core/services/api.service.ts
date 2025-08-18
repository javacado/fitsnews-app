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

type WpPost = {
  id: number;
  date: string;
  link: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  _embedded?: {
    ['wp:featuredmedia']?: Array<{ source_url?: string }>;
  };
};

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  // Mock API base (later swap for your real WordPress host)
  private base = 'http://localhost:4000/wp-json/wp/v2';

  listArticles(page = 1, perPage = 10) {
    const url = `${this.base}/posts?per_page=${perPage}&page=${page}&_embed=1`;
    return this.http.get<WpPost[]>(url, { observe: 'response' }).pipe(
      map((resp) => {
        const posts = resp.body ?? [];
        return posts.map(this.toArticle);
      })
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
}
