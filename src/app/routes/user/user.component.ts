import { Component, OnInit, forwardRef, Inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { filter, map, flatMap } from 'rxjs/operators';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';

import { IAccount } from '../../core/account/account.interface';
import { INetworkAccount, INetwork } from '../../core/network/network.interface';

import { NetworksService } from '../../core/network/networks.service';
import { AccountService } from '../../core/account/account.service';

import { AbstractPageComponent } from '../../layout/page/page.interface';
import { PageLayoutComponent } from '../../layout/page/page.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: [ './user.component.scss' ],
})
export class UserComponent extends AbstractPageComponent implements OnInit, OnDestroy {

  network: INetwork;
  accounts: IAccount[] = [];

  private accountSub: Subscription;

  constructor(
    @Inject(forwardRef(() => PageLayoutComponent)) pageLayout: PageLayoutComponent,
    private networkService: NetworksService,
    private accountService: AccountService
  ) {
    super(pageLayout, {});
  }

  ngOnInit(): void {
    this.accountSub = combineLatest(
      this.networkService.selectedNetwork$,
      this.accountService.accounts$
    )
    .pipe(
      filter(([ network, accounts ]) => !!accounts)
    )
    .subscribe(([ network, accounts ]) => {
      this.network = network;
      this.accounts = accounts;
    });
  }

  ngOnDestroy(): void {
    this.accountSub.unsubscribe();
  }

  isActive(account: IAccount): boolean {
    return this.network && account.network.id === this.network.id;
  }

  onSelectAccount(networkAccount: INetworkAccount): void {
    this.accountService.selectAccount(networkAccount);
  }
}
