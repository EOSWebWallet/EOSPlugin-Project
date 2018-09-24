import { Component, Inject, forwardRef } from '@angular/core';
import { IListItem } from '../../shared/list/list.interface';
import { TranslatePipe } from '@ngx-translate/core';

import { AbstractPageComponent } from '../../layout/page/page.interface';
import { PageLayoutComponent } from '../../layout/page/page.component';

@Component({
  selector: 'app-keys',
  templateUrl: './keys.component.html',
  styleUrls: [ './keys.component.scss' ]
})
export class KeysComponent extends AbstractPageComponent {

  items: IListItem[] = [
    { link: '/app/keys/accounts', label: 'routes.keys.accounts.menu', icon: 'icon-edit' },
    { link: '', label: 'routes.keys.generate', icon: 'icon-generate-key' },
    { link: '', label: 'routes.keys.import', icon: 'icon-import' }
  ];

  constructor(
    @Inject(forwardRef(() => PageLayoutComponent)) pageLayout: PageLayoutComponent,
  ) {
    super(pageLayout, {});
  }
}
