import { Component, ViewChild } from '@angular/core';
import { ScrollbarComponent } from 'ngx-scrollbar';

import { IPageConfig } from './page.interface';

@Component({
  selector: 'app-page-layout',
  templateUrl: './page.component.html',
  styleUrls: [ './page.component.scss' ]
})
export class PageLayoutComponent {
  @ViewChild(ScrollbarComponent) scrollRef: ScrollbarComponent;

  page: IPageConfig = {};

  update(): void {
    setTimeout(() => this.scrollRef.update());
  }
}
