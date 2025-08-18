// src/main.ts

import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { appConfig } from './app/app.config';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

import { addIcons } from 'ionicons';
import {
  homeOutline,
  albumsOutline,
  searchOutline,
  bookmarkOutline,
  ellipsisVertical,
  settingsOutline,
  flameOutline,
  flashOutline,
} from 'ionicons/icons';

// Make these names available immediately (no network requests needed)
addIcons({
  'home-outline': homeOutline,
  'albums-outline': albumsOutline,
  'search-outline': searchOutline,
  'bookmark-outline': bookmarkOutline,
  'ellipsis-vertical': ellipsisVertical,
  'settings-outline': settingsOutline,
  'flame-outline': flameOutline,
  'flash-outline': flashOutline,
});

// src/main.ts  (or at the very top of src/app/app.config.ts)
 import { setAssetPath } from 'ionicons';

// If your angular.json copies SVGs to "svg", point Ionicons to it:
 setAssetPath('/');






bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideIonicAngular(),
    provideHttpClient(withInterceptorsFromDi()),
  ],
}).catch((err) => console.error(err));
