import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs/internal/Subscription';
import { map, flatMap, first } from 'rxjs/operators';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';

import { INetworkAccountInfo, INetworkAccountAction } from '../../core/account/account.interface';

import { AccountService } from '../../core/account/account.service';

import { ConfirmDialogComponent } from '../../shared/dialog/confirm/confirm-dialog.component';

import { AccountUtils } from '../../core/account/account.utils';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ]
})
export class DashboardComponent implements OnInit {

  accountInfo: INetworkAccountInfo = {};
  accountActions: INetworkAccountAction[] = [];

  private accountSub: Subscription;

  constructor(
    public dialog: MatDialog,
    private accountService: AccountService
  ) { }

  readonly selectedAccount$ = this.accountService.selectedAccount$;

  readonly selectedNetworkAccount$ = this.selectedAccount$
    .pipe(
      map(a => a.accounts.find(na => na.selected))
    );

  readonly selectedNetworkAccountName$ = this.selectedNetworkAccount$
    .pipe(
      map(na => na.name)
    );

  ngOnInit(): void {
    combineLatest(
      this.selectedAccount$,
      this.selectedNetworkAccount$
    )
    .pipe(
      flatMap(([ account, networkAccount ]) => combineLatest(
        this.accountService.getInfo(account, networkAccount),
        this.accountService.getActions(account, networkAccount)
      )),
      first()
    )
    .subscribe(([ accountInfo, actions ]) => {
      this.accountInfo = accountInfo;
      this.accountActions = actions;
    });
  }
}
