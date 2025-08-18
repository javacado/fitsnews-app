import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

//import { IonicModule, InfiniteScrollCustomEvent } from '@ionic/angular';
import {
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonList,
  IonItem,
  IonLabel,
  IonThumbnail,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  InfiniteScrollCustomEvent,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Article } from '../../core/models/article';
import { RouterLink } from '@angular/router';
import { HeaderActionsComponent } from '../../shared/components/header-actions/header-actions.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonList,
    IonItem,
    IonLabel,
    IonThumbnail,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    CommonModule,
    RouterLink,
    HeaderActionsComponent,
  ],
  templateUrl: './home.page.html',
})
export class HomePage {
  private api = inject(ApiService);
  private router = inject(Router);
  // articles, load(), etc...

  articles: Article[] = [];
  page = 1;
  perPage = 10;
  loading = false;
  noMore = false;

  ionViewDidEnter() {
    this.load(true);
  }

  openArticle(a: { id: string; url?: string }) {
    console.log("CLICK")
    this.router.navigate(['/article', a.id], {
      queryParams: { url: a.url ?? '' },
    });
  }

  trackById = (_: number, a: Article) => a.id;

  load(reset = false) {
    if (this.loading) return;
    if (reset) {
      this.page = 1;
      this.noMore = false;
      this.articles = [];
    }
    this.loading = true;

    this.api.listArticles(this.page, this.perPage).subscribe({
      next: (list) => {
        this.articles = [...this.articles, ...list];
        this.page++;
        this.noMore = list.length < this.perPage; // nothing more from server
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  handleRefresh(ev: CustomEvent) {
    this.load(true);
    (ev.target as HTMLIonRefresherElement).complete();
  }

  handleInfinite(ev: InfiniteScrollCustomEvent) {
    this.load();
    // complete regardless; if noMore, disable to stop future events
    ev.target.complete().then(() => {
      if (this.noMore) {
        (ev.target as HTMLIonInfiniteScrollElement).disabled = true;
      }
    });
  }
}
// export class HomePage {
//   private router = inject(Router);
//   // articles, load(), etc...

//   openArticle(a: { id: string; url?: string }) {
//     this.router.navigate(['/article', a.id], {
//       queryParams: { url: a.url ?? '' },
//     });
//   }
// }