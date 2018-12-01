import { Component, OnInit, forwardRef, Inject, LOCALE_ID, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
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
import { AccountsComponent } from '../keys/accounts/accounts.component';

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
  hasNetworks: boolean;

  private accountActionsSub: Subscription;
  private accountInfoSub: Subscription;

  constructor(
    @Inject(forwardRef(() => PageLayoutComponent)) pageLayout: PageLayoutComponent,
    private router: Router,
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
    this.accountInfoSub = this.eosService.accountInformation$
      .subscribe(info => this.accountInfo = info);

    this.accountActionsSub = this.eosService.actionsHistory$
      .subscribe(actions => this.accountActions = actions);

    this.networkService.networks$
      .pipe(
        first()
      )
      .subscribe(networks => this.hasNetworks = !!networks.length);
  }

  ngOnDestroy(): void {
    this.accountInfoSub.unsubscribe();
    this.accountActionsSub.unsubscribe();
  }

  get hasAccountInfo(): boolean {
    return !!Object.keys(this.accountInfo)
      .find(key => !!this.accountInfo[key]);
  }

  onLock(): void {
    this.authService.lock();
  }

  onCreateAccount(): void {
    this.router.navigateByUrl(AccountsComponent.PATH_ACCOUNT);
  }
}
