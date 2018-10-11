import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { map, flatMap, filter } from 'rxjs/internal/operators';
import { from } from 'rxjs/internal/observable/from';

import { INetwork, INetworkAccount } from '../network/network.interface';
import { IChainInfo, INetworkAccountInfo, INetworkAccountAction } from './eos.interface';
import { IAccount } from '../account/account.interface';

import { AccountService } from '../account/account.service';

import { EOSUtils } from './eos.utils';

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

  readonly accountActions$ = this.accountService.selectedAccount$
    .pipe(
      filter(Boolean),
      map(account => ({
        account,
        networkAccount: account.accounts.find(na => na.selected)
      })),
      flatMap(({ account, networkAccount }) => this.getActions(account, networkAccount))
    );

  constructor(
    private httpClient: HttpClient,
    private accountService: AccountService
  ) { }

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
    return from(EOSUtils.getKeyAccounts(network.protocol, network.host, network.port, publicKey));
  }

  getAccountInfo(account: IAccount, networkAccount: INetworkAccount): Observable<INetworkAccountInfo> {
    const { protocol, host, port } = account.network;
    return from(EOSUtils.getAccountInfo(protocol, host, port, networkAccount.name))
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
    return from(EOSUtils.getActions(protocol, host, port, newtworkAccount.name))
      .pipe(
        map(res => {
          return res;
        })
      );
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
    if (accountInfo.core_liquid_balance) {
      resultInfo.totalBalance = Number(accountInfo.core_liquid_balance.split(' ', 1)[0]) + Number(accountInfo.voter_info.staked);
    } else {
      resultInfo.totalBalance = Number(accountInfo.voter_info.staked);
    }
    resultInfo.usdTotal = Number((Number(resultInfo.totalBalance) * usdCourse).toFixed(3));
    resultInfo.cpuUsedSec = Number(accountInfo.cpu_limit.used) / 1000000;
    resultInfo.cpuMaxSec = Number(accountInfo.cpu_limit.max) / 1000000;
    resultInfo.netUsedKb = Number(accountInfo.net_limit.used) / 1000;
    resultInfo.netMaxKb = Number(accountInfo.net_limit.max) / 1000;
    resultInfo.ramUsedKb = Number(accountInfo.ram_usage) / 1000;
    resultInfo.ramMaxKb = Number(accountInfo.ram_quota) / 1000;
    if (accountInfo.core_liquid_balance) {
      resultInfo.unstaked = Number(accountInfo.core_liquid_balance.split(' ', 1)[0]);
      resultInfo.usdUnstaked = Number((resultInfo.unstaked * usdCourse).toFixed(3));
    }
    if (accountInfo.voter_info && accountInfo.voter_info.staked) {
      resultInfo.staked = Number(accountInfo.voter_info.staked);
      resultInfo.usdStaked = Number((resultInfo.staked * usdCourse).toFixed(3));
    }
    return resultInfo;
  }
}