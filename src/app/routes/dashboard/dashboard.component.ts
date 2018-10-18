import { Component, OnInit, forwardRef, Inject } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import { map, flatMap, first, filter, withLatestFrom, } from 'rxjs/operators';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';

import { INetworkAccountInfo, INetworkAccountAction } from '../../core/eos/eos.interface';

import { AccountService } from '../../core/account/account.service';
import { EOSService } from '../../core/eos/eos.service';
import { AuthService } from '../../core/auth/auth.service';

import { AbstractPageComponent } from '../../layout/page/page.interface';
import { PageLayoutComponent } from '../../layout/page/page.component';

import { AccountUtils } from '../../core/account/account.utils';
import { InfoDialogComponent } from '../../shared/dialog/info/info-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ]
})
export class DashboardComponent extends AbstractPageComponent implements OnInit {

  accountInfo: INetworkAccountInfo = {};
  accountActions: INetworkAccountAction[] = [];

  constructor(
    @Inject(forwardRef(() => PageLayoutComponent)) pageLayout: PageLayoutComponent,
    private accountService: AccountService,
    private eosService: EOSService,
    private authService: AuthService
  ) {
    super(pageLayout, {});
  }

  readonly selectedNetworkAccountName$ = this.accountService.selectedAccount$
    .pipe(
      filter(Boolean),
      map(a => a.accounts.find(na => na.selected)),
      map(na => na && `${na.name}@${na.authority}`)
    );

  ngOnInit(): void {
    combineLatest(
      this.eosService.accountInfo$,
      this.eosService.accountActions$
    )
    .pipe(
      first(),
      withLatestFrom(this.accountService.selectedAccount$),
      map(([ [ info, actions ], selectedAccount ]) => ({
        info,
        actions: actions.map(a => ({
          ...a,
          direction: a.to === selectedAccount.name ? 'from' : 'to'
        }))
      }))
    )
    .subscribe(({ info, actions }) => {
      this.accountInfo = info;
      this.accountActions = actions;
    });
  }

  onLock(): void {
    this.authService.lock();
  }
}
