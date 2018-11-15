import { Component, OnInit, forwardRef, Inject, LOCALE_ID, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import { TranslateService } from '@ngx-translate/core';
import { map, flatMap, first, filter, withLatestFrom, } from 'rxjs/operators';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';

import { INetworkAccountInfo, INetworkAccountAction } from '../../core/eos/eos.interface';

import { AccountService } from '../../core/account/account.service';
import { EOSService } from '../../core/eos/eos.service';
import { AuthService } from '../../core/auth/auth.service';

import { AbstractPageComponent } from '../../layout/page/page.interface';
import { PageLayoutComponent } from '../../layout/page/page.component';

import { Accounts } from '../../core/account/account';
import { InfoDialogComponent } from '../../shared/dialog/info/info-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ],
  providers: [
    {
      provide: LOCALE_ID,
      deps: [ TranslateService ],
      useFactory: translate => translate.currentLang
    }
  ]
})
export class DashboardComponent extends AbstractPageComponent implements OnInit, OnDestroy {

  accountInfo: INetworkAccountInfo = {};
  accountActions: INetworkAccountAction[];

  private accountActionsSub: Subscription;

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
      map(a => a && a.accounts.find(na => na.selected)),
      map(na => na && `${na.name}@${na.authority}`)
    );

  ngOnInit(): void {
    this.eosService.accountInfo$
      .pipe(
        first()
      )
      .subscribe(info => this.accountInfo = info);

    this.accountActionsSub = this.eosService.actionsHistory$
      .subscribe(actions => this.accountActions = actions);
  }

  ngOnDestroy(): void {
    this.accountActionsSub.unsubscribe();
  }

  get hasAccountInfo(): boolean {
    return Object.keys(this.accountInfo).length > 0;
  }

  onLock(): void {
    this.authService.lock();
  }
}
