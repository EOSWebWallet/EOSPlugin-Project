import { Component, Input } from '@angular/core';
import { IListItem } from './list.interface';

@Component({
  selector: 'app-list',
  templateUrl: 'list.component.html',
  styleUrls: [ 'list.component.scss' ]
})
export class ListComponent {

  @Input() items: IListItem[];
}
