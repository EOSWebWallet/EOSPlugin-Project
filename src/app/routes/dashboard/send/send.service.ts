import * as Eos from 'eosjs';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { first, flatMap, map } from 'rxjs/operators';

import { ISendParams, ISignupOptions } from './send.interface';
import { ISignatureResult } from '../../../core/eos/eos.interface';
import { ExtensionMessageType } from '../../../core/message/message.interface';

import { AccountService } from '../../../core/account/account.service';
import { ExtensionMessageService } from '../../../core/message/message.service';
import { NetworksService } from '../../../core/network/networks.service';

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
    private networkService: NetworksService,
    private accountService: AccountService
  ) { }

  send(params: ISendParams): void {
    combineLatest(
      this.accountService.selectedAccount$,
      this.accountService.selectedNetworkAccount$
    )
    .pipe(
      first(),
      flatMap(([ account, networkAccount ]) =>
        this.networkService.getInfo(account.network)
          .pipe(
            map(networkInfo => ({ account, networkAccount, networkInfo }))
          )
      )
    ).subscribe(({ account, networkAccount, networkInfo }) =>
      this.eosInstance({ ...account.network, chainId: networkInfo.chainId }, Eos, {}, 'https').transaction(tr => {
        tr.transfer(networkAccount.name, params.recipient, `${Number(params.quantity).toFixed(4)} ${params.symbol}`, params.memo, {
          broadcast: true,
          sign: true,
          authorization: [{ actor: networkAccount.name, permission: networkAccount.authority }],
          verbose: true,
        });
      })
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
}
