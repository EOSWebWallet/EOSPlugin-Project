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

import { Networks } from '../../../core/network/network';

@Component({
  selector: 'app-networks',
  templateUrl: './networks.component.html',
  styleUrls: [ './networks.component.scss' ],
})
export class NetworksComponent extends AbstractPageComponent implements OnInit {

  newNetwork: INetwork;
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
    this.newNetwork = Networks.createNetwork();
    this.editableNetwork = null;
  }

  onUpdate(): void {
    this.networskService.update(this.editableNetwork.id, this.editableNetwork);
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
      this.editableNetwork = { ...network };
      this.newNetwork = null;
    }
  }

  onCreate(): void {
    this.networskService.save(this.newNetwork);
    this.newNetwork = null;
  }

  onCancel(event: any): void {
    event.preventDefault();
    this.newNetwork = null;
    this.editableNetwork = null;
  }

  hasAccounts(network: INetwork): boolean {
    return !!this.accounts.find(a => a.network.id === network.id);
  }

  isEditing(network: INetwork): boolean {
    return network && this.editableNetwork && network.id === this.editableNetwork.id;
  }
}
