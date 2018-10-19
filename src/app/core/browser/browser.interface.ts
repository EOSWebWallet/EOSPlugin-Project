export interface IBrowserAPI {
  storage?: any;
  runtime?: any;
  extension?: any;
  windows?: any;
}

export enum BrowserType {
  CHROME,
  FIREFOX
}

export interface IBrowserStorage {
  local: {
    set: (value: any, cb: Function) => void;
    get: (key: string, cb: Function) => void;
    clear: () => void;
  };
}

export interface BrowserStream {
  send(msg: any): Promise<any>;
  watch(callback: any): void;
}
