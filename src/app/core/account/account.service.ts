import { Actions } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/internal/Observable';
import { map, first, flatMap } from 'rxjs/internal/operators';
import { from } from 'rxjs/internal/observable/from';

import { IAppState } from '../state/state.interface';
import { IAccount, INetworkAccountInfo, INetworkAccountAction } from './account.interface';
import { IPlugin } from '../plugin/plugin.interface';
import { INetworkAccount, INetwork } from '../network/network.interface';

import { AbstractActionService } from '../state/actions.service';

import { PluginUtils } from '../plugin/plugin.utils';
import { AccountUtils } from './account.utils';

@Injectable()
export class AccountService extends AbstractActionService {

  constructor(
    protected actions: Actions,
    protected store: Store<IAppState>,
    private httpClient: HttpClient,
  ) {
    super();
  }

  get accounts$(): Observable<IAccount[]> {
    return this.plugin$
      .pipe(
        map(plugin => plugin.keychain.accounts)
      );
  }

  get selectedAccount$(): Observable<IAccount> {
    return this.plugin$
      .pipe(
        map(plugin =>
          plugin.keychain.accounts.find(a => !!a.accounts.find(aa => aa.selected))
        )
      );
  }

  save(account: IAccount): void {
    this.accounts$
      .pipe(first())
      .subscribe(accounts => this.set([ ...accounts, account ]));
  }

  delete(account: IAccount): void {
    this.accounts$
      .pipe(first())
      .subscribe(accounts =>
        this.set(accounts.filter(a => a !== account))
      );
  }

  selectAccount(networkAccount: INetworkAccount): void {
    this.accounts$
      .pipe(first())
      .subscribe(accounts =>
        this.set(accounts.map(account => ({
          ...account,
          accounts: account.accounts.map(networkAcc => ({
            ...networkAcc,
            selected: networkAcc === networkAccount
              ? !networkAccount.selected
              : networkAcc.selected
          }))
        })))
      );
  }

  deleteAccount(networkAccount: INetworkAccount): void {
    this.accounts$
      .pipe(first())
      .subscribe(accounts =>
        this.set(accounts.map(account => ({
          ...account,
          accounts: account.accounts.filter(networkAcc => networkAcc !== networkAccount)
        })))
      );
  }

  getKeyAccounts(network: INetwork, publicKey: string): Observable<INetworkAccount[]> {
    return from(AccountUtils.getKeyAccounts(network.protocol, network.host, network.port, publicKey));
  }

  getInfo(account: IAccount, networkAccount: INetworkAccount): Observable<INetworkAccountInfo> {
    const { protocol, host, port } = account.network;
    return from(AccountUtils.getInfo(protocol, host, port, networkAccount.name))
      .pipe(
        flatMap(accountInfo =>
          this.getCurrentCourse()
            .pipe(
              map(courses => this.mapAccountInfo(accountInfo, courses))
            )
        )
      );
  }

  getActions(account: IAccount, newtworkAccount: INetworkAccount): Observable<INetworkAccountAction[]> {
    const { protocol, host, port } = account.network;
    return from(AccountUtils.getActions(protocol, host, port, newtworkAccount.name))
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  private getCurrentCourse (): Observable<any> {
    return this.httpClient.get('https://api.coingecko.com/api/v3/coins/eos');
  }

  private mapAccountInfo(accountInfo: any, courses: any): INetworkAccountInfo {
    const resultInfo: INetworkAccountInfo = {};
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
    resultInfo.usdTotal = Number(resultInfo.totalBalance) * Number(courses.market_data.current_price.usd);
    resultInfo.cpuUsedSec = Number(accountInfo.cpu_limit.used) / 1000000;
    resultInfo.cpuMaxSec = Number(accountInfo.cpu_limit.max) / 1000000;
    resultInfo.netUsedKb = Number(accountInfo.net_limit.used) / 1000;
    resultInfo.netMaxKb = Number(accountInfo.net_limit.max) / 1000;
    resultInfo.ramUsedKb = Number(accountInfo.ram_usage) / 1000;
    resultInfo.ramMaxKb = Number(accountInfo.ram_quota) / 1000;
    if (accountInfo.core_liquid_balance) {
      resultInfo.unstaked = Number(accountInfo.core_liquid_balance.split(' ', 1)[0]);
    }
    if (accountInfo.voter_info && accountInfo.voter_info.staked) {
      resultInfo.staked = Number(accountInfo.voter_info.staked);
    }
    return resultInfo;
  }

  private set(accounts: IAccount[]): void {
    this.plugin$
      .pipe(first())
      .subscribe((plugin: IPlugin) =>
        this.dispatchAction(PluginUtils.PLUGIN_STORE, {
          ...plugin,
          keychain: {
            ...plugin.keychain,
            accounts
          }
        })
      );
  }
}
