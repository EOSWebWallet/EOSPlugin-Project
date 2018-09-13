import { IBrowserAPI } from './browser.interface';

declare var chrome: any;
declare var browser: any;

export const BrowserAPI: IBrowserAPI = chrome || browser;
