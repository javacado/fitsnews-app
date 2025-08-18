import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonSearchbar,
  IonList,
  IonListHeader,
  IonItem,
  IonLabel,
  IonThumbnail,
  IonBadge,
  IonChip,
  IonIcon,
  IonButton,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonSpinner,
  IonText,
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import {
  ApiService,
  Article,
  Author,
  Section,
} from '../../core/services/api.service';
import { HeaderActionsComponent } from '../../shared/components/header-actions/header-actions.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    HeaderActionsComponent,
    RouterLink,
    IonContent,
    IonSearchbar,
    IonList,
    IonListHeader,
    IonItem,
    IonLabel,
    IonThumbnail,
    IonBadge,
    IonChip,
    IonIcon,
    IonButton,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonSpinner,
    IonText,
  ],
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage {
  private api = inject(ApiService);

  // Query and filters
  query = '';
  selectedAuthor?: Author;
  selectedSection?: Section;

  // Results
  stories: Article[] = [];
  authors: Author[] = [];
  sections: Section[] = [];

  // Paging for stories
  page = 1;
  perPage = 10;
  loadingStories = false;
  noMoreStories = true; // until a query or filter is set

  trackById = (_: number, a: { id: any }) => a.id;

  onSearchInput(ev: Event) {
    const value = (ev.target as HTMLIonSearchbarElement).value?.trim() ?? '';
    this.query = value;
    // clear filters when typing a new query
    this.selectedAuthor = undefined;
    this.selectedSection = undefined;
    this.reloadAll();
  }

  onClear() {
    this.query = '';
    this.selectedAuthor = undefined;
    this.selectedSection = undefined;
    this.clearResults();
  }

  // --- filtering by author/section ----
  filterByAuthor(a: Author) {
    this.selectedAuthor = a;
    this.selectedSection = undefined;
    this.reloadStoriesOnly();
  }
  filterBySection(s: Section) {
    this.selectedSection = s;
    this.selectedAuthor = undefined;
    this.reloadStoriesOnly();
  }
  clearFilters() {
    this.selectedAuthor = undefined;
    this.selectedSection = undefined;
    this.reloadStoriesOnly();
  }

  // --- loading logic ---
  private clearResults() {
    this.stories = [];
    this.authors = [];
    this.sections = [];
    this.page = 1;
    this.noMoreStories = true;
    this.loadingStories = false;
  }

  private reloadAll() {
    this.clearResults();
    if (!this.query) return;
    // fetch authors + sections in parallel (first page only)
    this.api
      .searchAuthors(this.query, 1, 10)
      .subscribe((a) => (this.authors = a));
    this.api
      .searchSections(this.query, 1, 10)
      .subscribe((s) => (this.sections = s));
    // fetch first page of stories
    this.noMoreStories = false;
    this.fetchStoriesPage();
  }

  private reloadStoriesOnly() {
    this.stories = [];
    this.page = 1;
    this.noMoreStories = false;
    this.fetchStoriesPage();
  }

  private fetchStoriesPage(done?: () => void) {
    if (this.loadingStories || this.noMoreStories) {
      done?.();
      return;
    }
    this.loadingStories = true;

    this.api
      .searchArticles(this.query, this.page, this.perPage, {
        authorId: this.selectedAuthor?.id,
        categoryId: this.selectedSection?.id,
      })
      .subscribe({
        next: (list) => {
          this.stories = [...this.stories, ...list];
          this.page++;
          this.noMoreStories = list.length < this.perPage;
          this.loadingStories = false;
          done?.();
        },
        error: () => {
          this.loadingStories = false;
          done?.();
        },
      });
  }

  handleInfinite(ev: CustomEvent) {
    this.fetchStoriesPage(() =>
      (ev.target as HTMLIonInfiniteScrollElement).complete()
    );
  }
}
