import { Component } from '@angular/core';
import { INavLink } from './layout.interface';

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

}
