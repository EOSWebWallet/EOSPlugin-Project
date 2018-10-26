import { Component, ViewChildren, ViewChild, OnInit, forwardRef, Inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { Subscribable, Subscription } from 'rxjs';
import { first } from 'rxjs/internal/operators';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';

import { IAccount } from '../../../core/account/account.interface';
import { INetworkAccount, INetwork } from '../../../core/network/network.interface';

import { AccountService } from '../../../core/account/account.service';
import { NetworksService } from '../../../core/network/networks.service';

import { AbstractPageComponent } from '../../../layout/page/page.interface';
import { PageLayoutComponent } from '../../../layout/page/page.component';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: [ './accounts.component.scss' ]
})
export class AccountsComponent extends AbstractPageComponent implements OnInit, OnDestroy {
  static PATH_ACCOUNT = '/app/keys/accounts/account';

  network: INetwork;

  accounts: IAccount[];

  hasNetworks: boolean;

  private accountSub: Subscription;
  private networkSub: Subscription;

  constructor(
    @Inject(forwardRef(() => PageLayoutComponent)) pageLayout: PageLayoutComponent,
    private router: Router,
    private accountService: AccountService,
    private networkService: NetworksService
  ) {
    super(pageLayout, {
      backLink: '/app/keys',
      header: 'routes.keys.accounts.title',
    });
  }

  ngOnInit(): void {
    this.accountSub = this.accountService.accounts$
      .subscribe(accounts => this.accounts = accounts);

    this.networkService.networks$
      .pipe(
        first()
      )
      .subscribe(networks => this.hasNetworks = !!networks.length);

    this.networkSub = this.networkService.selectedNetwork$
      .subscribe(network => this.network = network);
  }

  ngOnDestroy(): void {
    this.accountSub.unsubscribe();
    this.networkSub.unsubscribe();
  }

  isActive(account: IAccount): boolean {
    return this.network && account.network.id === this.network.id;
  }

  onAdd(): void {
    this.router.navigateByUrl(AccountsComponent.PATH_ACCOUNT);
  }

  onEdit(account: IAccount): void {
    this.router.navigateByUrl(`${AccountsComponent.PATH_ACCOUNT}/${account.id}`);
  }

  onDelete(account: IAccount): void {
    this.accountService.delete(account.id);
  }

  onSelectAccount(account: IAccount, networkAccount: INetworkAccount): void {
    if (this.isActive(account)) {
      this.accountService.selectAccount(networkAccount);
    }
  }

  onDeleteAccount(networkAccount: INetworkAccount): void {
    this.accountService.deleteAccount(networkAccount);
  }
}
