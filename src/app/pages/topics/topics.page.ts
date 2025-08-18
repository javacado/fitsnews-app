import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonList,
  IonListHeader,
  IonItem,
  IonLabel,
  IonBadge,
} from '@ionic/angular/standalone';
// Reuse your shared header (optional). Remove if you prefer a raw ion-header.
import { HeaderActionsComponent } from '../../shared/components/header-actions/header-actions.component';

type Topic = { id: number; name: string; slug: string; count: number };
type Author = { id: number; name: string; slug: string; count: number };

@Component({
  selector: 'app-topics',
  standalone: true,
  imports: [
    CommonModule,
    HeaderActionsComponent,
    IonContent,
    IonList,
    IonListHeader,
    IonItem,
    IonLabel,
    IonBadge,
  ],
  templateUrl: './topics.page.html',
  styleUrls: ['./topics.page.scss'],
})
export class TopicsPage {
  // Placeholder data for now — swap with API later
  sections: Topic[] = [
    { id: 1, name: 'Politics', slug: 'politics', count: 128 },
    { id: 2, name: 'Business', slug: 'business', count: 96 },
    { id: 3, name: 'Technology', slug: 'technology', count: 74 },
    { id: 4, name: 'Health', slug: 'health', count: 65 },
    { id: 5, name: 'Sports', slug: 'sports', count: 83 },
    { id: 6, name: 'World', slug: 'world', count: 101 },
  ];

  authors: Author[] = [
    { id: 1, name: 'Jane Reporter', slug: 'jane-reporter', count: 42 },
    { id: 2, name: 'Mark Analyst', slug: 'mark-analyst', count: 37 },
    { id: 3, name: 'Alex Editor', slug: 'alex-editor', count: 29 },
    { id: 4, name: 'Sam Columnist', slug: 'sam-columnist', count: 22 },
    { id: 5, name: 'Taylor Writer', slug: 'taylor-writer', count: 18 },
  ];

  trackById = (_: number, x: { id: number }) => x.id;
}
