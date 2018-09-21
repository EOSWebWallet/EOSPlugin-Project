import { Component, ViewChild } from '@angular/core';
import { ScrollbarComponent } from 'ngx-scrollbar';

import { IPage } from './page.interface';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: [ './page.component.scss' ]
})
export class PageComponent {
  @ViewChild(ScrollbarComponent) scrollRef: ScrollbarComponent;

  page: IPage = {};

  update(): void {
    setTimeout(() => this.scrollRef.update());
  }
}
