import { Component, inject } from '@angular/core';
import { IonicModule, InfiniteScrollCustomEvent } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Article } from '../../core/models/article';
import { RouterLink } from '@angular/router';
import { HeaderActionsComponent } from '../../shared/components/header-actions/header-actions.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink, HeaderActionsComponent],
  templateUrl: './home.page.html',
})
export class HomePage {
  private api = inject(ApiService);
  articles: Article[] = [];
  page = 1;
  loading = true;

  ionViewDidEnter() {
    this.load(true);
  }
  load(reset = false) {
    if (reset) {
      this.page = 1;
      this.articles = [];
    }
    this.loading = true;
    this.api.listArticles(this.page).subscribe(
      (list) => {
        this.articles = [...this.articles, ...list];
        this.page++;
        this.loading = false;
      },
      () => (this.loading = false)
    );
  }
  handleRefresh(ev: CustomEvent) {
    this.load(true);
    (ev.target as any).complete();
  }
  handleInfinite(ev: InfiniteScrollCustomEvent) {
    this.load();
    ev.target.complete();
  }
}
