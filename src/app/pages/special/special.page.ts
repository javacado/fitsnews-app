import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, InfiniteScrollCustomEvent } from '@ionic/angular';
import { HeaderActionsComponent } from '../../shared/components/header-actions/header-actions.component';

@Component({
  selector: 'app-special',
  templateUrl: './special.page.html',
  styleUrls: ['./special.page.scss'],
  standalone: true,
  imports: [IonicModule, HeaderActionsComponent, CommonModule, FormsModule]
})
export class SpecialPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
