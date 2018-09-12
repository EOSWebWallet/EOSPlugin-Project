export interface IBrowserStorage {
  get: (key: string, cb: (value: any) => void) => void;
  set: (value: any, cb: () => void) => void;
}
