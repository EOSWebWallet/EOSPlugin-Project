import { Component, OnInit, forwardRef, Inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { filter, map, flatMap } from 'rxjs/operators';

import { IAccount } from '../../core/account/account.interface';
import { INetworkAccount } from '../../core/network/network.interface';

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
    this.accountSub = this.networkService.selectedNetwork$
      .pipe(
        filter(Boolean),
        flatMap(network =>
          this.accountService.accounts$
            .pipe(
              map(accounts => accounts.filter(a => a.network.id === network.id))
            )
        )
      )
      .subscribe(accounts => this.accounts = accounts);
  }

  ngOnDestroy(): void {
    this.accountSub.unsubscribe();
  }

  onSelectAccount(networkAccount: INetworkAccount): void {
    this.accountService.selectAccount(networkAccount);
  }
}
