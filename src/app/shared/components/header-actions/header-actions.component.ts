import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-actions',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './header-actions.component.html',
  styleUrls: ['./header-actions.component.scss'],
})
export class HeaderActionsComponent {
  /** Center title text */
  @Input() title = '';

  /** Show a back button on the left */
  @Input() showBack = false;

  /** Where the back button should go if history is empty */
  @Input() defaultHref: string | undefined;

  /** Show the kebab (menu) button on the right */
  @Input() showMenuButton = true;

  /** Pass an Ionic color name (e.g., 'primary', 'dark', 'light') */
  @Input() color?: string;

  /** Make header translucent (nice on iOS) */
  @Input() translucent = true;
}
