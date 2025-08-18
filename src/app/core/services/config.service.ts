import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';

export interface SpecialTabConfig {
  enabled: boolean;
  title: string;
  path: string; // route segment, e.g. "murdaugh"
  icon: string; // Ionicons name like "flame-outline"
  color: string; // "#hex" or "rgb(...)" etc.
}
export interface RemoteConfig {
  specialTab: SpecialTabConfig;
}

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private http = inject(HttpClient);
  private cfg$ = new BehaviorSubject<RemoteConfig | null>(null);
  readonly config$ = this.cfg$.asObservable();

  load(): Observable<RemoteConfig | null> {
    if (this.cfg$.value) return of(this.cfg$.value);
    return this.http.get<RemoteConfig>('/wp-json/fitsnews/v1/config').pipe(
      tap((cfg) => this.cfg$.next(cfg)),
      catchError(() => {
        this.cfg$.next({
          specialTab: {
            enabled: false,
            title: '',
            path: '',
            icon: '',
            color: '',
          },
        });
        return of(this.cfg$.value);
      }),
      shareReplay(1)
    );
  }

  get snapshot(): RemoteConfig | null {
    return this.cfg$.value;
  }
}
