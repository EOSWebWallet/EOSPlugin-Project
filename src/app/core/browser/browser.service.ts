import { Injectable } from '@angular/core';
import { IBrowserAPI } from './browser.interface';

declare var chrome: any;
declare var browser: any;

@Injectable()
export class BrowserAPIService {

  get browserAPI(): IBrowserAPI {
    return chrome || browser;
  }
}
