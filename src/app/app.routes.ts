import { Routes } from '@angular/router';
import { specialTabCanMatch } from './core/guards/special-tab.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      {
        path: 'feed',
        loadComponent: () =>
          import('./pages/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'topics',
        loadComponent: () =>
          import('./pages/topics/topics.page').then((m) => m.TopicsPage),
      },
      {
        path: 'search',
        loadComponent: () =>
          import('./pages/search/search.page').then((m) => m.SearchPage),
      },
      {
        path: 'bookmarks',
        loadComponent: () =>
          import('./pages/bookmarks/bookmarks.page').then(
            (m) => m.BookmarksPage
          ),
      },
      { path: '', pathMatch: 'full', redirectTo: 'feed' },
    ],
  },
  // Special tab route is guarded; if disabled it won't match
  {
    path: ':specialPath', // e.g. /murdaugh
    canMatch: [specialTabCanMatch],
    loadComponent: () =>
      import('./pages/special/special.page').then((m) => m.SpecialPage),
  },
  // Article detail (full screen, no tabs)
  {
    path: 'article/:id',
    loadComponent: () =>
      import('./pages/article/article.page').then((m) => m.ArticlePage),
  },
  { path: '**', redirectTo: '' },
];
