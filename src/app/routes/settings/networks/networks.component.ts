import { Component, forwardRef, Inject, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { first } from 'rxjs/operators';

import { INetwork } from '../../../core/network/network.interface';
import { IPageConfig, AbstractPageComponent } from '../../../layout/page/page.interface';

import { NetworksService } from '../../../core/network/networks.service';

import { PageLayoutComponent } from '../../../layout/page/page.component';

import { NetworkUtils } from '../../../core/network/network.utils';

@Component({
  selector: 'app-networks',
  templateUrl: './networks.component.html',
  styleUrls: [ './networks.component.scss' ],
})
export class NetworksComponent extends AbstractPageComponent implements AfterViewInit {

  editableNetwork: INetwork;

  constructor(
    @Inject(forwardRef(() => PageLayoutComponent)) pageLayout: PageLayoutComponent,
    private networskService: NetworksService,
  ) {
    super(pageLayout, {
      backLink: '/app/settings',
      header: 'routes.settings.networks.title',
      footer: 'routes.settings.networks.add',
      action: () => this.onAdd()
    });
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
    this.networskService.update(network.id, network);
    this.editableNetwork = null;
  }

  onDelete(network: INetwork): void {
    this.networskService.delete(network.id);
  }

  onSelect(network: INetwork): void {
    this.networskService.select(network.id);
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
