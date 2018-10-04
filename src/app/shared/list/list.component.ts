import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatNavList } from '@angular/material/list';

import { IListItem } from './list.interface';

@Component({
  selector: 'app-list',
  templateUrl: 'list.component.html',
  styleUrls: [ 'list.component.scss' ]
})
export class ListComponent {

  @Input() items: IListItem[];

  @Output() select = new EventEmitter<IListItem>();

  onSelect(item: IListItem): void {
    this.select.emit(item);
  }
}
