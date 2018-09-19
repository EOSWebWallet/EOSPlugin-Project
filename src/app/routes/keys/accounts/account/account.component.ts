import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Subscription } from 'rxjs/internal/Subscription';
import { map, first } from 'rxjs/internal/operators';

import { IAccount } from '../../../../core/account/account.interface';
import { INetwork, INetworkAccount } from '../../../../core/network/network.interface';
import { ISelectOption } from '../../../../shared/form/select/select.interface';

import { AccountService } from '../../../../core/account/account.service';
import { NetworksService } from '../../../../core/network/networks.service';

import { NetworkUtils } from '../../../../core/network/network.utils';
import { KeypairUtils } from '../../../../core/keypair/keypair.utils';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
})
export class AccountComponent implements OnInit {

  account: Partial<IAccount> = {
    keypair: {
      privateKey: '',
      publicKey: ''
    }
  };

  networks: INetwork[] = [];
  networkOptions: ISelectOption[] = [];

  accounts: INetworkAccount[] = [];
  accountOptions: ISelectOption[] = [];

  constructor(
    private router: Router,
    private accountService: AccountService,
    private networksService: NetworksService,
  ) { }

  ngOnInit(): void {
    this.networksService.networks$
      .pipe(first())
      .subscribe(networks => {
        this.networks = networks;
        this.networkOptions = this.networks.map(network => ({
          label: network.name,
          value: network.name
        }));
      });
  }

  async generatePublicKey(): Promise<void> {
    this.account.keypair = await KeypairUtils.makePublicKey(this.account.keypair);
  }

  onNetworkSelect(networkOption: ISelectOption): void {
    const network = this.networks.find(n => n.name === networkOption.value);
    this.accountService.getKeyAccounts(network, this.account.keypair.publicKey)
      .pipe(first())
      .subscribe(accounts => {
        this.accounts = accounts;
        this.accountOptions = this.accounts.map(account => ({
          label: account.name,
          value: account.name
        }));
      });
  }

  onSave(form: any): void {
    this.accountService.save({
      name: form.name,
      keypair: {
        privateKey: form.privateKey,
        publicKey: form.publicKey
      },
      network: this.networks.find(n => n.name === form.network.value),
      accounts: this.accounts.filter(a => form.account.find(fa => fa.value === a.name))
    });
  }
}
