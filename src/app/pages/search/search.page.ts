import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, InfiniteScrollCustomEvent } from '@ionic/angular';

import { FormsModule } from '@angular/forms';
import { HeaderActionsComponent } from '../../shared/components/header-actions/header-actions.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HeaderActionsComponent],
})
export class SearchPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
