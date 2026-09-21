import { LOCALE_ID, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './core/config/routes.config';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideNativeDateAdapter } from '@angular/material/core';
import { OVERLAY_DEFAULT_CONFIG } from '@angular/cdk/overlay';
import { MAT_DATE_LOCALE } from '@angular/material/core';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'de-CH' },
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'de-CH' },
    { provide: OVERLAY_DEFAULT_CONFIG, useValue: { usePopover: false } },
  ],
};
