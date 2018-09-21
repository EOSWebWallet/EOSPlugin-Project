import { Component, forwardRef, Inject, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { first } from 'rxjs/operators';

import { INetwork } from '../../../core/network/network.interface';
import { IPage } from '../../../layout/page/page.interface';

import { NetworksService } from '../../../core/network/networks.service';

import { PageComponent } from '../../../layout/page/page.component';

import { NetworkUtils } from '../../../core/network/network.utils';

@Component({
  selector: 'app-networks',
  templateUrl: './networks.component.html',
  styleUrls: [ './networks.component.scss' ],
})
export class NetworksComponent implements AfterViewInit {

  private page: IPage = {
    backLink: '/app/settings',
    header: 'routes.settings.networks.title',
    footer: 'routes.settings.networks.add',
    action: () => this.onAdd()
  };

  constructor(
    @Inject(forwardRef(() => PageComponent)) private navPage: PageComponent,
    private networskService: NetworksService,
  ) {
    navPage.page = this.page;
  }

  ngAfterViewInit(): void {
    this.navPage.update();
  }

  get networks$(): Observable<INetwork[]> {
    return this.networskService.networks$;
  }

  onAdd(): void {
    this.networskService.networks$
      .pipe(first())
      .subscribe(networks => this.networskService.save(this.createNew(networks)));
  }

  onUpdate(network: INetwork): void {
    this.networskService.update(network);
  }

  onDelete(network: INetwork): void {
    this.networskService.delete(network);
  }

  onSelect(network: INetwork): void {
    this.networskService.select(network);
  }

  private createNew(networks: INetwork[]): INetwork {
    const last = networks
      .map(n => n.name)
      .filter(n => n.startsWith(NetworkUtils.NETWORK_PREFIX))
      .map(n => parseInt(n.replace(NetworkUtils.NETWORK_PREFIX, ''), 10))
      .sort((a, b) => a - b)
      .pop() || 0;
    return NetworkUtils.createNetwork(NetworkUtils.NETWORK_PREFIX + (last + 1));
  }
}
