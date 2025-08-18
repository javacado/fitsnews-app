export interface Article {
  id: string;
  title: string;
  summary?: string;
  imageUrl?: string;
  url: string;
  publishedAt?: string; // ISO
  source?: string;
}
