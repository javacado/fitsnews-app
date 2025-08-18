import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConfigService } from '../../core/services/config.service';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterOutlet, RouterLink],
  templateUrl: './tabs.page.html',
})
export class TabsPage {
  cfg = inject(ConfigService);
  // ensure config is loaded early
  constructor() {
    this.cfg.load().subscribe();
  }
}
