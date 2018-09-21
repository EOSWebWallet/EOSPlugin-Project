export interface IPage {
  backLink?: string;
  header?: string;
  footer?: string;
  action?: () => void;
}
