import { Component } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators';

import { INavLink } from './layout.interface';

import { NetworksService } from '../core/network/networks.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: [ './layout.component.scss' ],
})
export class LayoutComponent {

  navLinks: INavLink[] = [
    { icon: 'home', path: 'home' },
    { icon: 'vpn_key', path: 'keys' },
    { icon: 'settings', path: 'settings' }
  ];

  constructor(private networkService: NetworksService) {
  }

  get selectedNetwork$(): Observable<string> {
    return this.networkService.selectedNetwork$
      .pipe(
        map(network => network ? network.name : '')
      );
  }

}
