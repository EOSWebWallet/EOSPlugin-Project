import { Component } from '@angular/core';

import { IListItem } from '../../shared/list/list.interface';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: [ './settings.component.scss' ]
})
export class SettingsComponent {

  items: IListItem[] = [
    { link: '/app/settings/networks', label: 'routes.settings.networks.menu', icon: 'icon-network' },
    { link: '', label: 'routes.settings.language', icon: 'icon-language' },
    { link: '', label: 'routes.settings.changePassword', icon: 'icon-lock' },
    { link: '', label: 'routes.settings.import', icon: 'icon-import' },
    { link: '', label: 'routes.settings.export', icon: 'icon-export' },
    { link: '', label: 'routes.settings.destroy', icon: 'icon-destroy' },
    { link: '', label: 'routes.settings.about', icon: 'icon-about' },
  ];
}
