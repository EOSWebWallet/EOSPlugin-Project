import * as Eos from 'eosjs';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { first, flatMap, map } from 'rxjs/operators';

import { ISendParams, ISignupOptions } from './send.interface';
import { ISignatureResult } from '../../../core/eos/eos.interface';
import { ExtensionMessageType } from '../../../core/message/message.interface';

import { AccountService } from '../../../core/account/account.service';
import { EOSService } from '../../../core/eos/eos.service';

import { EOS } from '../../../core/eos/eos';
import { Keypairs } from '../../../core/keypair/keypair';
import { Browser } from '../../../core/browser/browser';

@Injectable()
export class SendService {
  readonly signature$ = new BehaviorSubject<ISignupOptions>(null);

  readonly eosInstance = EOS.create({
    requestSignature: signargs =>
      new Promise<ISignatureResult>(signup => {
        this.accountService.selectedAccount$
          .pipe(
            first(),
          ).subscribe(account => this.signature$.next({ signup, signargs, keypair: account.keypair }));
      })
  });

  constructor(
    private eosService: EOSService,
    private accountService: AccountService
  ) { }

  get signupOptions(): ISignupOptions {
    return this.signature$.value;
  }

  send(params: ISendParams): Observable<void> {
    return combineLatest(
      this.accountService.selectedAccount$,
      this.accountService.selectedNetworkAccount$
    )
    .pipe(
      first(),
      flatMap(([ account, networkAccount ]) =>
        this.eosService.getInfo(account.network)
          .pipe(
            map(networkInfo => ({ account, networkAccount, networkInfo }))
          )
      ),
      flatMap(({ account, networkAccount, networkInfo }) => {
        const tokenItem = this.eosService.userSymbol.filter(p => p[0] == params.symbol);
        const accountName = tokenItem[0][1];
        const precision = Number(tokenItem[0][2]);

        return this.eosInstance({ ...account.network, chainId: networkInfo.chainId }, Eos, {}, 'https').transaction(accountName, tr => {
          tr.transfer(networkAccount.name, params.recipient.toLowerCase(), `${Number(params.quantity).toFixed(precision)} ${params.symbol}`, params.memo, {
            broadcast: true,
            sign: true,
            authorization: [{ actor: networkAccount.name, permission: networkAccount.authority }],
            verbose: true,
          });
        });
      })
    );
  }

  signup(): void {
    const signupOptions = this.signature$.value;
    Browser.stream.send({
      type: ExtensionMessageType.SIGNUP,
      // Need stringify data because of Firefox
      payload: JSON.stringify({ signargs: signupOptions.signargs, keypair: signupOptions.keypair })
    }).then(result => {
      if (result) {
        this.signature$.next(null);
        signupOptions.signup(result);
      }
    });
  }

  deny(): void {
    this.signature$.next(null);
  }
}
