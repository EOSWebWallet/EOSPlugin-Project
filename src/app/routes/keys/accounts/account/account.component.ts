import { Component, OnInit, OnDestroy, forwardRef, Inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Subscription } from 'rxjs/internal/Subscription';
import { map, first } from 'rxjs/internal/operators';

import { IAccount } from '../../../../core/account/account.interface';
import { INetwork, INetworkAccount } from '../../../../core/network/network.interface';
import { ISelectOption } from '../../../../shared/form/select/select.interface';
import { IPageConfig, AbstractPageComponent } from '../../../../layout/page/page.interface';

import { AccountService } from '../../../../core/account/account.service';
import { NetworksService } from '../../../../core/network/networks.service';

import { PageLayoutComponent } from '../../../../layout/page/page.component';

import { NetworkUtils } from '../../../../core/network/network.utils';
import { KeypairUtils } from '../../../../core/keypair/keypair.utils';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: [ './account.component.scss' ]
})
export class AccountComponent extends AbstractPageComponent implements OnInit {

  @ViewChild('form') form: FormGroup;

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
    @Inject(forwardRef(() => PageLayoutComponent)) pageLayout: PageLayoutComponent,
    private router: Router,
    private accountService: AccountService,
    private networksService: NetworksService,
  ) {
    super(pageLayout, {
      backLink: '/app/keys',
      header: 'routes.keys.accounts.account.title',
      footer: 'routes.keys.accounts.account.save',
      action: () => this.onSave()
    });
  }

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

  onSave(): void {
    const data = this.form.value;
    this.accountService.save({
      name: data.name,
      keypair: {
        privateKey: data.privateKey,
        publicKey: data.publicKey
      },
      network: this.networks.find(n => n.name === data.network.value),
      accounts: this.accounts.filter(a => data.account.find(fa => fa.value === a.name))
    });
  }
}
