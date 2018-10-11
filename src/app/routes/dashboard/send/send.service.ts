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
import { ExtensionMessageService } from '../../../core/message/message.service';
import { EOSService } from '../../../core/eos/eos.service';

import { EOSUtils } from '../../../core/eos/eos.utils';
import { KeypairUtils } from '../../../core/keypair/keypair.utils';

@Injectable()
export class SendService {
  readonly signature$ = new BehaviorSubject<ISignupOptions>(null);

  readonly eosInstance = EOSUtils.createEOS({
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
      flatMap(({ account, networkAccount, networkInfo }) => this.eosInstance({ ...account.network, chainId: networkInfo.chainId }, Eos, {}, 'https').transaction(tr => {
        tr.transfer(networkAccount.name, params.recipient, `${Number(params.quantity).toFixed(4)} ${params.symbol}`, params.memo, {
          broadcast: true,
          sign: true,
          authorization: [{ actor: networkAccount.name, permission: networkAccount.authority }],
          verbose: true,
        });
      }))
    );
  }

  signup(): void {
    const signupOptions = this.signature$.value;
    ExtensionMessageService.send({
      type: ExtensionMessageType.DECRYPT_KEYPAIR,
      payload: signupOptions.keypair
    }).then(keypair =>
      EOSUtils.signer(keypair.privateKey, signupOptions.signargs, signature => {
        this.signature$.next(null);
        signupOptions.signup({ signatures: [ signature ] });
      })
    );
  }

  deny(): void {
    this.signature$.next(null);
  }
}
