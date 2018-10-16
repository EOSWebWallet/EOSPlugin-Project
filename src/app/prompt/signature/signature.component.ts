import { Component, ViewChild, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ScrollbarComponent } from 'ngx-scrollbar';
import { map, first, filter } from 'rxjs/internal/operators';

import { IAccount, IAccountIdentity } from '../../core/account/account.interface';
import { INetworkAccount, INetwork } from '../../core/network/network.interface';

import { ISignaturePromtOptions } from '../../core/prompt/prompt.interface';

import { PromptService } from '../prompt.service';
import { AccountService } from '../../core/account/account.service';
import { ExtensionMessageService } from '../../core/message/message.service';

import { AccountUtils } from '../../core/account/account.utils';
import { PromptUtils } from '../../core/prompt/prompt.utils';
import { ExtensionMessageType } from '../../core/message/message.interface';

@Component({
  selector: 'app-prompt-signature',
  templateUrl: './signature.component.html',
  styleUrls: [ './signature.component.scss' ]
})
export class SignatureComponent implements OnInit {
  @ViewChild(ScrollbarComponent) scrollRef: ScrollbarComponent;

  keys = Object.keys;

  activeTab = 0;

  account: IAccount;

  constructor(
    private accountService: AccountService,
    private promptService: PromptService,
  ) { }

  ngOnInit(): void {
    this.accountService.accounts$
      .pipe(
        filter(Boolean),
        map(accounts => AccountUtils.getAccount(this.identity, accounts)),
        first()
      )
      .subscribe(account => {
        this.account = account;
      });
  }

  get signargs(): any {
    return (<ISignaturePromtOptions> this.promptService.prompt).signargs;
  }

  get identity(): IAccountIdentity {
    return (<ISignaturePromtOptions> this.promptService.prompt).identity;
  }

  get networkAccount(): INetworkAccount {
    return this.account && AccountUtils.getNetworkAccount(this.identity.accounts[0], this.account);
  }

  get network(): INetwork {
    return this.account && this.account.network;
  }

  onAccept(): void {
    ExtensionMessageService.send({
      type: ExtensionMessageType.SIGNUP,
      payload: { signargs: this.signargs, keypair: this.account.keypair }
    }).then(signature => {
      this.promptService.prompt.responder(signature);
      PromptUtils.close();
    });
  }

  onDeny(): void {
    this.promptService.prompt.responder(false);
    PromptUtils.close();
  }

  changeTab(activeTab: number): void {
    this.activeTab = activeTab;
    setTimeout(() => this.scrollRef.update());
  }
}
