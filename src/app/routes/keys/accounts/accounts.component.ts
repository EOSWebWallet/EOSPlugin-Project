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

  accounts: IAccount[];

  selectedNetwork: INetwork;

  accountSub: Subscription;

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
    this.accountSub = combineLatest(
      this.accountService.accounts$,
      this.networkService.selectedNetwork$
    )
    .subscribe(([ accounts, network ]) => {
      this.accounts = accounts;
      this.selectedNetwork = network;
    });
  }

  ngOnDestroy(): void {
    this.accountSub.unsubscribe();
  }

  isDisabled(account: IAccount): boolean {
    return !this.selectedNetwork || account.network.name !== this.selectedNetwork.name;
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

  onSelectAccount(networkAccount: INetworkAccount): void {
    this.accountService.selectAccount(networkAccount);
  }

  onDeleteAccount(networkAccount: INetworkAccount): void {
    this.accountService.deleteAccount(networkAccount);
  }
}
