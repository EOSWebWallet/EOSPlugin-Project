import { Component, Input } from '@angular/core';
import { INavListItem } from './list.interface';

@Component({
  selector: 'app-nav-list',
  templateUrl: 'list.component.html',
  styleUrls: [ 'list.component.scss' ]
})
export class NavListComponent {

  @Input() items: INavListItem[];
}
