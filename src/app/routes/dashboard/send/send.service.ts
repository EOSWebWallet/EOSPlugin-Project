import * as Eos from 'eosjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { first } from 'rxjs/operators';

import { ISendParams, SignupCallback } from './send.interface';
import { IAccount } from '../../../core/account/account.interface';
import { INetworkAccount } from '../../../core/network/network.interface';
import { ISignatureResult } from '../../../core/eos/eos.interface';

import { AccountService } from '../../../core/account/account.service';

import { EOSUtils } from '../../../core/eos/eos.utils';

@Injectable()
export class SendService {

  readonly signature$ = new BehaviorSubject<SignupCallback>(null);

  readonly eosInstance = EOSUtils.createEOS({
    requestSignature: signargs =>
      new Promise<ISignatureResult>(resolve => this.signature$.next(resolve))
  });

  constructor(
    private router: Router,
    private accountService: AccountService
  ) { }

  send(params: ISendParams): void {
    combineLatest(
      this.accountService.selectedAccount$,
      this.accountService.selectedNetworkAccount$
    )
    .pipe(
      first()
    ).subscribe(([ account, networkAccount ]) =>
      this.eosInstance(account.network, Eos, {}).transaction(tr => {
        tr.transfer(networkAccount.name, params.recipient, `${params.quantity.toFixed(4)} ${params.symbol}`, params.memo, {
          broadcast: true,
          sign: true,
          authorization: [{ actor: networkAccount.name, permission: networkAccount.authority }],
          verbose: true,
          keyProvider: account.keypair.publicKey
        });
      })
    );
  }
}
