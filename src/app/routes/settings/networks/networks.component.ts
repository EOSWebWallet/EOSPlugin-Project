import { Component, forwardRef, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import { first, map, filter } from 'rxjs/operators';

import { IAccount } from '../../../core/account/account.interface';
import { INetwork } from '../../../core/network/network.interface';
import { IPageConfig, AbstractPageComponent } from '../../../layout/page/page.interface';

import { NetworksService } from '../../../core/network/networks.service';
import { AccountService } from '../../../core/account/account.service';

import { PageLayoutComponent } from '../../../layout/page/page.component';

import { NetworkUtils } from '../../../core/network/network.utils';

@Component({
  selector: 'app-networks',
  templateUrl: './networks.component.html',
  styleUrls: [ './networks.component.scss' ],
})
export class NetworksComponent extends AbstractPageComponent implements OnInit {

  editableNetwork: INetwork;

  accounts: IAccount[] = [];

  constructor(
    @Inject(forwardRef(() => PageLayoutComponent)) pageLayout: PageLayoutComponent,
    private networskService: NetworksService,
    private accountService: AccountService
  ) {
    super(pageLayout, {
      backLink: '/app/settings',
      header: 'routes.settings.networks.title',
      footer: 'routes.settings.networks.add',
      action: () => this.onAdd()
    });
  }

  ngOnInit(): void {
    this.accountService.accounts$
      .pipe(
        filter(Boolean),
        first()
      )
      .subscribe(accounts => this.accounts = accounts);
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

  onEdit(network: INetwork): void {
    if (!this.hasAccounts(network)) {
      this.editableNetwork = network;
    }
  }

  hasAccounts(network: INetwork): boolean {
    return !!this.accounts.find(a => a.network.id === network.id);
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
