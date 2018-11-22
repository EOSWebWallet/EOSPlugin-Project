import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import {
  map, flatMap, filter, catchError, startWith, first,
  tap, switchMap, 
} from 'rxjs/internal/operators';
import { from } from 'rxjs/internal/observable/from';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { of } from 'rxjs/internal/observable/of';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { interval } from 'rxjs/internal/observable/interval';

import { INetwork, INetworkAccount } from '../network/network.interface';
import { IChainInfo, INetworkAccountInfo, INetworkAccountAction, Tokens } from './eos.interface';
import { IAccount } from '../account/account.interface';

import { AccountService } from '../account/account.service';
import { AuthService } from '../auth/auth.service';

import { EOS } from './eos';

@Injectable()
export class EOSService {

  readonly courses$ = this.requestCurrentCourses();

  readonly accountInfo$ = this.accountService.selectedAccount$
    .pipe(
      filter(Boolean),
      map(account => ({
        account,
        networkAccount: account.accounts.find(na => na.selected)
      })),
      flatMap(({ account, networkAccount }) => this.getAccountInfo(account, networkAccount))
    );

  readonly actions$ = this.accountService.selectedAccount$
    .pipe(
      filter(Boolean),
      map(account => ({
        account,
        networkAccount: account.accounts.find(na => na.selected)
      })),
      flatMap(({ account, networkAccount }) =>
        this.getActions(account, networkAccount)
          .pipe(
            map(actions => actions.map(a => ({
              ...a,
              direction: a.to === account.name ? 'from' : 'to'
            })))
          )
      )
    );

  readonly symbols$ = this.accountService.selectedAccount$
    .pipe(
      filter(Boolean),
      map(account => ({
        account,
        networkAccount: account.accounts.find(na => na.selected)
      })),
      flatMap(({ account, networkAccount }) => this.getSymbols(account, networkAccount))
    );

  readonly actionsHistory$ = new BehaviorSubject<INetworkAccountAction[]>(null);

  constructor(
    private httpClient: HttpClient,
    private accountService: AccountService,
    private authService: AuthService
  ) {
    this.accountService.selectedAccount$
      .pipe(
        filter(Boolean),
        tap(() => this.actionsHistory$.next(null)),
        switchMap(() =>
          interval(10000)
            .pipe(
              startWith(true)
            )
        ),
        tap(value => value > 1 && !this.actionsHistory$.value && this.actionsHistory$.next([])),
        switchMap(init =>
          (
            init === true
              ? interval(500)
                .pipe(
                  flatMap(() =>
                    this.actions$
                      .pipe(
                        first()
                      )
                  ),
                )
              : this.actions$
          )
          .pipe(
            filter(actions => actions && !!actions.length),
            catchError(() => of([])),
            first(),
          )
        ),
      )
      .subscribe(actions => this.actionsHistory$.next(actions));
  }

  requestCurrentCourses(): Observable<any> {
    return this.httpClient.get('https://api.coingecko.com/api/v3/coins/eos');
  }

  getInfo(network: INetwork): Observable<IChainInfo> {
    return this.httpClient.post(`${network.protocol}://${network.host}:${network.port}/v1/chain/get_info`, '')
      .pipe(
        map(info => ({
          chainId: (<any>info).chain_id
        }))
      );
  }

  getKeyAccounts(network: INetwork, publicKey: string): Observable<INetworkAccount[]> {
    return from(EOS.getKeyAccounts(network.protocol, network.host, network.port, publicKey));
  }

  getAccountInfo(account: IAccount, networkAccount: INetworkAccount): Observable<INetworkAccountInfo> {
    const { protocol, host, port } = account.network;
    return from(EOS.getAccountInfo(protocol, host, port, networkAccount.name))
      .pipe(
        flatMap(accountInfo =>
          this.courses$
            .pipe(
              filter(Boolean),
              map(courses => this.mapAccountInfo(accountInfo, courses))
            )
        )
      );
  }

  getActions(account: IAccount, newtworkAccount: INetworkAccount): Observable<INetworkAccountAction[]> {
    const { protocol, host, port } = account.network;
    return from(EOS.getActions(protocol, host, port, newtworkAccount.name))
      .pipe(
        map(res => this.mapAccountActions(res.actions))
      );
  }

  getSymbols(account: IAccount, newtworkAccount: INetworkAccount): Observable<string[]> {
    const { protocol, host, port } = account.network;
    return forkJoin(Tokens.map(token =>
      from(EOS.getTokenInfo(protocol, host, port, token, newtworkAccount.name))
        .pipe(
          catchError(err => of(false))
        )
    ))
    .pipe(
      map(result => result.filter(item => item !== false && item.length > 0)),
      filter(result => result && !!result.length),
      map(result => {
        const userSymbols = [];
        result.forEach(resultArr => {
          resultArr.forEach(element => {
            const symbol = element.substring(element.lastIndexOf(' ') + 1);
            const findSymbol = userSymbols.map(s => s.toLocaleLowerCase()).find(s => symbol.toLocaleLowerCase());
            if (!findSymbol) {
              userSymbols.push(symbol);
            }
          });
        });
        return userSymbols;
      })
    );
  }

  private mapAccountActions(actions: any[]): INetworkAccountAction[] {
    return actions
      .reverse()
      .filter(a => a.action_trace.act.name === 'transfer')
      .slice(0, 4)
      .map(a => ({
        from: a.action_trace.act.data.from,
        to: a.action_trace.act.data.to,
        quantity: a.action_trace.act.data.quantity.split(' ')[0],
        symbol: a.action_trace.act.data.quantity.split(' ')[1],
        date: a.block_time
      }));
  }

  private mapAccountInfo(accountInfo: any, courses: any): INetworkAccountInfo {
    const resultInfo: INetworkAccountInfo = {};
    const usdCourse = Number(courses.market_data.current_price.usd);
    resultInfo.netPercent = Math.round(Number(accountInfo.net_limit.used) / Number(accountInfo.net_limit.max) * 100);
    resultInfo.cpuPercent = Math.round(Number(accountInfo.cpu_limit.used) / Number(accountInfo.cpu_limit.max) * 100);
    if (accountInfo.total_resources.net_weight) {
      resultInfo.netData = accountInfo.total_resources.net_weight.split(' ', 1).toString();
    }
    if (accountInfo.total_resources.cpu_weight) {
      resultInfo.cpuData = accountInfo.total_resources.cpu_weight.split(' ', 1).toString();
    }
    if (!Number.isNaN(Number.parseFloat(resultInfo.netData))) {
      resultInfo.netData = parseFloat(resultInfo.netData).toFixed(2).toString();
    }
    if (!Number.isNaN(Number.parseFloat(resultInfo.cpuData))) {
      resultInfo.cpuData = parseFloat(resultInfo.cpuData).toFixed(2).toString();
    }
    resultInfo.ramPercent = Math.round(Number(accountInfo.ram_usage) / Number(accountInfo.ram_quota) * 100);
    resultInfo.totalBalance = Number(accountInfo.core_liquid_balance.split(' ', 1)[0]) + Number(accountInfo.voter_info.staked) / 10000;
    resultInfo.usdTotal = Number((Number(resultInfo.totalBalance) * usdCourse).toFixed(3));
    resultInfo.cpuUsedSec = Number((Number(accountInfo.cpu_limit.used) / 1000000).toFixed(3));
    resultInfo.cpuMaxSec = Number((Number(accountInfo.cpu_limit.max) / 1000000).toFixed(3));
    resultInfo.netUsedKb = Number((Number(accountInfo.net_limit.used) / 1000).toFixed(3));
    resultInfo.netMaxKb = Number((Number(accountInfo.net_limit.max) / 1000).toFixed(3));
    resultInfo.ramUsedKb = Number((Number(accountInfo.ram_usage) / 1000).toFixed(3));
    resultInfo.ramMaxKb = Number((Number(accountInfo.ram_quota) / 1000).toFixed(3));
    if (accountInfo.core_liquid_balance) {
      resultInfo.unstaked = Number(accountInfo.core_liquid_balance.split(' ', 1)[0]);
      resultInfo.usdUnstaked = Number((resultInfo.unstaked * usdCourse).toFixed(3));
    }
    if (accountInfo.voter_info && accountInfo.voter_info.staked) {
      resultInfo.staked = Number(accountInfo.voter_info.staked) / 10000;
      resultInfo.usdStaked = Number((resultInfo.staked * usdCourse).toFixed(3));
    }
    return resultInfo;
  }
}
