import { Component } from '@angular/core';
import { INavListItem } from '../../shared/nav-list/list.interface';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-keys',
  templateUrl: './keys.component.html',
  styleUrls: [ './keys.component.scss' ]
})
export class KeysComponent {

  items: INavListItem[] = [
    { link: '/app/keys/accounts', label: 'routes.keys.accounts.menu', icon: 'icon-edit' },
    { link: '', label: 'routes.keys.generate', icon: 'icon-generate-key' },
    { link: '', label: 'routes.keys.import', icon: 'icon-import' }
  ];
}
