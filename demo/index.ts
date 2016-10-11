// require('./styles.css');

import { AppModule } from './app.module';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

function main(): any {
  return platformBrowserDynamic().bootstrapModule(AppModule);
}

document.addEventListener('DOMContentLoaded', () => main());
