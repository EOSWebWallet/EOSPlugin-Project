import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-nav-header',
  templateUrl: 'header.component.html',
  styleUrls: [ 'header.component.scss' ]
})
export class NavHeaderComponent {

  @Input() backLink: string;
  @Input() title: string;
}
