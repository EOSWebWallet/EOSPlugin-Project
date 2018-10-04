export interface IListItem {
  link?: string;
  label: string;
  icon: string;
  value?: any;
  selected?: () => boolean;
}
