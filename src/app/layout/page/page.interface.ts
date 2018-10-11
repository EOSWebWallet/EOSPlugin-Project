import { PageLayoutComponent } from './page.component';
import { AfterViewInit, OnDestroy } from '@angular/core';

export interface IPageConfig {
  backLink?: string;
  header?: string;
  footer?: string;
  action?: () => void;
  disabled?: () => void;
  back?: () => void;
}


export abstract class AbstractPageComponent implements AfterViewInit, OnDestroy {

  constructor(
    protected pageLayout: PageLayoutComponent,
    protected pageConfig: IPageConfig
  ) {
    this.pageLayout.page = pageConfig;
  }

  ngAfterViewInit(): void {
    this.pageLayout.update();
  }

  ngOnDestroy(): void {
    this.pageLayout.page = {};
  }
}
