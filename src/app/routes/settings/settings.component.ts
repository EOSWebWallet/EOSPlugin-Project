import { Component, Inject, forwardRef } from '@angular/core';

import { IListItem } from '../../shared/list/list.interface';

import { AbstractPageComponent } from '../../layout/page/page.interface';
import { PageLayoutComponent } from '../../layout/page/page.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: [ './settings.component.scss' ]
})
export class SettingsComponent extends AbstractPageComponent {

  items: IListItem[] = [
    { link: '/app/settings/networks', label: 'routes.settings.networks.menu', icon: 'icon-network' },
    { link: '', label: 'routes.settings.language', icon: 'icon-language' },
    { link: '', label: 'routes.settings.changePassword', icon: 'icon-lock' },
    { link: '', label: 'routes.settings.import', icon: 'icon-import' },
    { link: '', label: 'routes.settings.export', icon: 'icon-export' },
    { link: '/app/settings/destroy', label: 'routes.settings.destroy.menu', icon: 'icon-destroy' },
    { link: '', label: 'routes.settings.about', icon: 'icon-about' },
  ];

  constructor(
    @Inject(forwardRef(() => PageLayoutComponent)) pageLayout: PageLayoutComponent,
  ) {
    super(pageLayout, {});
  }
}
