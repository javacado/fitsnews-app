// src/app/pages/article/article.page.ts
import { Component } from '@angular/core';
import { IonicModule, InfiniteScrollCustomEvent } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HeaderActionsComponent } from '../../shared/components/header-actions/header-actions.component';

@Component({
  standalone: true,
  selector: 'app-article',
  imports: [IonicModule, CommonModule, HeaderActionsComponent],
  templateUrl: './article.page.html'

  
})
export class ArticlePage {}
