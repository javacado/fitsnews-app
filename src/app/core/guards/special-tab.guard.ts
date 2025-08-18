import { CanMatchFn } from '@angular/router';
import { inject } from '@angular/core';
import { ConfigService } from '../services/config.service';
import { map, take } from 'rxjs/operators';

export const specialTabCanMatch: CanMatchFn = () => {
  const svc = inject(ConfigService);
  return svc.load().pipe(
    map((cfg) => !!cfg?.specialTab?.enabled),
    take(1)
  );
};
