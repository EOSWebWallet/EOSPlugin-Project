import { Component, forwardRef, Inject } from '@angular/core';

import { AbstractPageComponent } from '../../../layout/page/page.interface';

import { PageLayoutComponent } from '../../../layout/page/page.component';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: [ './about.component.scss' ],
})
export class AboutComponent extends AbstractPageComponent {

  constructor(
    @Inject(forwardRef(() => PageLayoutComponent)) pageLayout: PageLayoutComponent,
  ) {
    super(pageLayout, {
      backLink: '/app/settings',
      header: 'routes.settings.about.title',
    });
  }
}
