import { Component, OnInit } from '@angular/core';
import { IonicModule, InfiniteScrollCustomEvent } from '@ionic/angular';
import { HeaderActionsComponent } from '../../shared/components/header-actions/header-actions.component';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-topics',
  templateUrl: './topics.page.html',
  styleUrls: ['./topics.page.scss'],
  standalone: true,
  imports: [
    IonicModule,   
    CommonModule,
    FormsModule,
    HeaderActionsComponent,
  ],
})
export class TopicsPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
