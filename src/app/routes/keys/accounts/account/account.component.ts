import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { IAccount } from '../../../../core/account/account.interface';

import { AccountService } from '../../../../core/account/account.service';

import { NetworkUtils } from '../../../../core/network/network.utils';
import { KeypairUtils } from '../../../../core/keypair/keypair.utils';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
})
export class AccountComponent {

  account: Partial<IAccount> = {
    keypair: {
      privateKey: '',
      publicKey: ''
    }
  };

  constructor(
    private router: Router,
    private accountService: AccountService,
  ) { }

  async generatePublicKey(): Promise<void> {
    this.account.keypair = await KeypairUtils.makePublicKey(this.account.keypair);
  }
}
