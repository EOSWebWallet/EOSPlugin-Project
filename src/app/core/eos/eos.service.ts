import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import {
  map, flatMap, filter, catchError, startWith, first,
  tap, switchMap
} from 'rxjs/internal/operators';
import { from } from 'rxjs/internal/observable/from';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { of } from 'rxjs/internal/observable/of';
import { interval } from 'rxjs/internal/observable/interval';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';

import { INetwork, INetworkAccount } from '../network/network.interface';
import { IChainInfo, INetworkAccountInfo, INetworkAccountAction, Tokens, NetworkChaindId } from './eos.interface';
import { IAccount } from '../account/account.interface';

import { AccountService } from '../account/account.service';
import { NetworksService } from 'src/app/core/network/networks.service';

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

  readonly accountInformation$ = new BehaviorSubject<INetworkAccountInfo>({});
  readonly actionsHistory$ = new BehaviorSubject<INetworkAccountAction[]>(null);

  readonly userSymbol: string[][] = [];

  constructor(
    private httpClient: HttpClient,
    private accountService: AccountService,
    private networkService: NetworksService
  ) {

    this.accountService.selectedAccount$
      .subscribe(() => {
        this.actionsHistory$.next(null);
        this.accountInformation$.next({});
      });

    this.accountService.selectedAccount$
      .pipe(
        filter(Boolean),
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

    interval(5000)
      .pipe(
        startWith(0),
        switchMap(() => combineLatest(
          this.accountInfo$
            .pipe(
              catchError(() => of(null))
            ),
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
            switchMap(([ network, account ]) => this.getTokenString(network, account)),
            catchError(() => of(''))
          )
        )),
      )
      .subscribe(([ info, tokenString ]) => this.accountInformation$.next({
        ...( info || this.accountInformation$.value ),
        tokenString: tokenString || this.accountInformation$.value.tokenString
      }));
  }

  requestCurrentCourses(): Observable<any> {
    return this.httpClient.get('https://api.coingecko.com/api/v3/coins/eos');
  }

  getTokensGreymass (accountName: string): Observable<any> {
    return this.httpClient.post(
      'https://eos.greymass.com:443/v1/chain/get_currency_balances', '{"account":"' + accountName + '"}').pipe(
      catchError(err => {
        return of(false);
      })
    );
  }

  getTokensEosflare (accountName: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient.post(
      'https://api-pub.eosflare.io/v1/eosflare/get_account', '{"account":"' + accountName + '"}', httpOptions).pipe(
      catchError(err => {
        return of(false);
      })
    );
  }

  getTokenInfo (network: INetwork, body: string): Observable<any> {
    return this.httpClient.post(`${network.protocol}://${network.host}:${network.port}/v1/chain/get_currency_balance` , body).pipe(
      catchError(err => {
        return of(false);
      })
    );
  }

  getAllTokensInfo (network: INetwork, tokens: string[][], accountName) {
    return forkJoin(tokens.map(token => this.getTokenInfo(network, '{"code":"' + token[0] + '","account":"' + accountName + '"}')))
      .pipe(map(result => {
        return result.filter(item => item !== false && item.length > 0);
      }));
  }

  getTokenString(network: INetwork, accountName: string): Observable<string> {
    return this.getInfo(network)
      .pipe(
        flatMap(({ chainId }) => Observable.create(o => {
          if (chainId === NetworkChaindId.MainNet) {
            this.getTokensGreymass(accountName).subscribe((tokens) => {
              if (tokens && tokens.length) {
                o.next(this.setTokensGreymassSymbol(tokens));
              } else {
                this.getTokensEosflare(accountName).subscribe((result) => {
                  if (result && result.account) {
                    o.next(this.setTokensEosflareSymbol(result.account.tokens));
                  } else {
                    this.getAllTokensInfo(network, Tokens, accountName).subscribe((allTokens) => {
                      o.next(this.setTokensSymbol(allTokens));
                    });
                  }
                });
              }
            });
          } else {
            this.getAllTokensInfo(network, Tokens, accountName).subscribe((tokens) => {
              o.next(this.setTokensSymbol(tokens));
            });
          }
        }))
      );
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
      from(EOS.getTokenInfo(protocol, host, port, token[0], newtworkAccount.name))
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
            const findSymbol = userSymbols.map(s => s.toLocaleLowerCase()).find(s => s === symbol.toLocaleLowerCase());
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
    resultInfo.totalBalance =
      parseFloat((Number(accountInfo.core_liquid_balance.split(' ', 1)[0]) + Number(accountInfo.voter_info.staked) / 10000).toFixed(3));
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

  private setTokensGreymassSymbol (tokens): string {
    let tokenStringTemp = ''
    tokens.forEach(rez => {
      tokenStringTemp += rez.amount + ' ' + rez.symbol + ', '
      let precision = rez.amount.split(".")[1] ? rez.amount.split(".")[1].length : 0
      this.addUserSymbol(rez.symbol, rez.code, precision)
    })
    return tokenStringTemp.substring(0, tokenStringTemp.length - 2)
  }

  private setTokensEosflareSymbol (tokens): string {
    let tokenStringTemp = ''
    tokens.forEach(rez => {
      tokenStringTemp += rez.balance + ' ' + rez.symbol + ', '
      let precision = rez.balance.split(".")[1] ? rez.balance.split(".")[1].length : 0
      this.addUserSymbol(rez.symbol, rez.code, precision)
    })
    return tokenStringTemp.substring(0, tokenStringTemp.length - 2)
  }

  private setTokensSymbol (tokens): string {
    if (tokens && tokens.length) {
      let tokenStringTemp = ''
      tokens.forEach(resultArr => {
        resultArr.forEach(element => {
          let name = element.substring(element.lastIndexOf(' ') + 1)
          let code = Tokens.filter(function(c) {
            return c[1] == name;
          });
          let precision
          if (element.indexOf('.') > -1){
            precision = element.split('.', 2)[1].split(' ',1)[0].length
          } else {
            precision = 0
          }
          this.addUserSymbol(name, code[0][0], precision)
          tokenStringTemp += element + ', '
        })
      })
      return tokenStringTemp.substring(0, tokenStringTemp.length - 2)
    }
    return ''
  }

  private addUserSymbol (symbol: string, code: string, precision: string) {
    let findSymbol = false
    this.userSymbol.forEach(element => {
      if (element[0].toLocaleLowerCase() === symbol.toLocaleLowerCase()) {
        findSymbol = true
        return
      }
    })
    if (!findSymbol) {
      this.userSymbol.push([symbol, code, precision])
    }
  }
}
