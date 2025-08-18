import { Injectable, inject } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({ providedIn: 'root' })
export class BookmarksService {
  private storage = inject(Storage);
  private ready = this.storage.create(); // init DB once

  async has(id: string) {
    await this.ready;
    return !!(await this.storage.get(`bm:${id}`));
  }
  async toggle(a: { id: string; [k: string]: any }) {
    await this.ready;
    const key = `bm:${a.id}`;
    if (await this.storage.get(key)) return this.storage.remove(key);
    return this.storage.set(key, a);
  }
}
