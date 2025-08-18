import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Article } from '../models/article';

@Injectable({ providedIn: 'root' })
export class BookmarksService {
  private key = 'bookmarks';
  private ready = this.storage.create();
  constructor(private storage: Storage) {}

  async all(): Promise<Article[]> {
    await this.ready;
    return (await this.storage.get(this.key)) ?? [];
  }
  async toggle(a: Article) {
    await this.ready;
    const bms: Article[] = (await this.storage.get(this.key)) ?? [];
    const i = bms.findIndex((b) => b.id === a.id);
    if (i >= 0) bms.splice(i, 1);
    else bms.unshift(a);
    await this.storage.set(this.key, bms);
    return bms;
  }
  async has(id: string) {
    return (await this.all()).some((b) => b.id === id);
  }
}
