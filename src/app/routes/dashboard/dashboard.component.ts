import { Component, OnInit, forwardRef, Inject, LOCALE_ID, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { TranslateService } from '@ngx-translate/core';
import { map, switchMap, first, filter, startWith, catchError, tap, } from 'rxjs/operators';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { interval } from 'rxjs/internal/observable/interval';
import { of } from 'rxjs/internal/observable/of';

import { INetworkAccountInfo, INetworkAccountAction } from '../../core/eos/eos.interface';

import { AccountService } from '../../core/account/account.service';
import { EOSService } from '../../core/eos/eos.service';
import { AuthService } from '../../core/auth/auth.service';
import { NetworksService } from 'src/app/core/network/networks.service';

import { AbstractPageComponent } from '../../layout/page/page.interface';
import { PageLayoutComponent } from '../../layout/page/page.component';


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
  tokenString: string;

  private accountActionsSub: Subscription;
  private accountInfoSub: Subscription;

  constructor(
    @Inject(forwardRef(() => PageLayoutComponent)) pageLayout: PageLayoutComponent,
    private accountService: AccountService,
    private eosService: EOSService,
    private authService: AuthService,
    private networkService: NetworksService
  ) {
    super(pageLayout, {});
  }

  readonly selectedNetworkAccountName$ = this.accountService.selectedAccount$
    .pipe(
      map(a => a && a.accounts.find(na => na.selected)),
      map(na => na && `${na.name}@${na.authority}`)
    );

  ngOnInit(): void {
    this.accountInfoSub = interval(5000)
      .pipe(
        startWith(0),
        switchMap(() => combineLatest(
          this.eosService.accountInfo$,
          combineLatest(
            this.networkService.selectedNetwork$,
            this.accountService.selectedAccount$
              .pipe(
                map(a => a && a.accounts.find(na => na.selected)),
                map(na => na && na.name),
              )
          )
          .pipe(
            filter(([ network, account ]) => !!network && !!account),
            first(),
            switchMap(([ network, account ]) => this.eosService.getTokenString(network, account))
          )
        )),
        catchError(() => of([])),
        filter(([ info, tokenString ]) => !!info && !!tokenString),
      )
      .subscribe(([ info, tokenString ]) => {
        this.accountInfo = info;
        this.tokenString = tokenString;
      });

    this.accountActionsSub = this.eosService.actionsHistory$
      .subscribe(actions => this.accountActions = actions);
  }

  ngOnDestroy(): void {
    this.accountInfoSub.unsubscribe();
    this.accountActionsSub.unsubscribe();
  }

  get hasAccountInfo(): boolean {
    return Object.keys(this.accountInfo).length > 0;
  }

  onLock(): void {
    this.authService.lock();
  }
}
