import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonButton,
  IonIcon,
  IonContent,
  IonImg,
  IonChip,
  IonLabel,
  IonSkeletonText,
} from '@ionic/angular/standalone';
//import { HeaderActionsComponent } from '../../shared/components/header-actions/header-actions.component';

import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ApiService, ArticleDetail } from '../../core/services/api.service';
import { Browser } from '@capacitor/browser';
import { Share } from '@capacitor/share';
// If you built the BookmarksService earlier:
import { BookmarksService } from '../../core/services/bookmarks.service';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonButton,
    IonIcon,
    IonContent,
    IonImg,
    IonChip,
    IonLabel,
    IonSkeletonText,
 //  HeaderActionsComponent,
  ],
  templateUrl: './article.page.html',
  styleUrls: ['./article.page.scss'],
})
export class ArticlePage {
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  private sanitizer = inject(DomSanitizer);
  private bookmarks = inject(BookmarksService);

  loading = true;
  article?: ArticleDetail;
  safeHtml?: SafeHtml;
  bookmarked = false;

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.loading = false;
      return;
    }

    this.api.getArticle(id).subscribe({
      next: async (a) => {
        this.article = a;
        this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(a.contentHtml);
        this.bookmarked = await this.bookmarks.has(a.id);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  async openOriginal() {
    if (this.article?.url) await Browser.open({ url: this.article.url });
  }

  async share() {
    if (!this.article) return;
    try {
      // await Share.share({
      //   title: this.article.title,
      //   text: this.article.summary || this.article.title,
      //   url: this.article.url,
      //   dialogTitle: 'Share',
      // });
    } catch {}
  }

  async toggleBookmark() {
    if (!this.article) return;
    await this.bookmarks.toggle(this.article);
    this.bookmarked = await this.bookmarks.has(this.article.id);
  }
}
