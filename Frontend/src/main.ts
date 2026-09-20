import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { registerLocaleData } from '@angular/common';
import localeDeCH from '@angular/common/locales/de-CH';

registerLocaleData(localeDeCH, 'de-CH');

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
