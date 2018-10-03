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
    { link: '/app/settings/password', label: 'routes.settings.password.menu', icon: 'icon-lock' },
    { link: '/app/settings/import', label: 'routes.settings.import.menu', icon: 'icon-import' },
    { link: '/app/settings/export', label: 'routes.settings.export.menu', icon: 'icon-export' },
    { link: '/app/settings/destroy', label: 'routes.settings.destroy.menu', icon: 'icon-destroy' },
    { link: '', label: 'routes.settings.about', icon: 'icon-about' },
  ];

  constructor(
    @Inject(forwardRef(() => PageLayoutComponent)) pageLayout: PageLayoutComponent,
  ) {
    super(pageLayout, {});
  }
}
