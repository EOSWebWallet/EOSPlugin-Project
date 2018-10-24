import { Component, OnInit, OnDestroy, forwardRef, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs/internal/Subject';
import { Subscription } from 'rxjs/internal/Subscription';
import { first, map, debounceTime } from 'rxjs/internal/operators';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { of } from 'rxjs/internal/observable/of';

import { IAccount } from '../../../../core/account/account.interface';
import { INetwork, INetworkAccount } from '../../../../core/network/network.interface';
import { ISelectOption } from '../../../../shared/form/select/select.interface';
import { IAccountForm } from './account.interface';

import { AccountService } from '../../../../core/account/account.service';
import { NetworksService } from '../../../../core/network/networks.service';
import { EOSService } from '../../../../core/eos/eos.service';

import { AbstractPageComponent } from '../../../../layout/page/page.interface';
import { PageLayoutComponent } from '../../../../layout/page/page.component';

import { Keypairs } from '../../../../core/keypair/keypair';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: [ './account.component.scss' ]
})
export class AccountComponent extends AbstractPageComponent implements OnInit, OnDestroy {
  @ViewChild('form') form: FormGroup;

  account: Partial<IAccountForm> = {
    keypair: {
      privateKey: '',
      publicKey: ''
    }
  };

  networks: INetwork[] = [];
  networkOptions: ISelectOption[] = [];

  accounts: INetworkAccount[] = [];
  accountOptions: ISelectOption[] = [];

  private privateKeyChanged$ = new Subject<void>();
  private privateKeySub: Subscription;

  constructor(
    @Inject(forwardRef(() => PageLayoutComponent)) pageLayout: PageLayoutComponent,
    private accountService: AccountService,
    private networksService: NetworksService,
    private eosService: EOSService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super(pageLayout, {
      backLink: '/app/keys/accounts',
      header: 'routes.keys.accounts.account.title',
      footer: 'routes.keys.accounts.account.save',
      action: () => this.onSave(),
      disabled: () => this.form.invalid
    });
  }

  ngOnInit(): void {
    combineLatest(
      this.networksService.networks$,
      this.accountId
        ? this.accountService.accounts$
          .pipe(
            map(accounts => accounts.find(a => a.id === this.accountId))
          )
        : of(null)
    )
    .pipe(
      first()
    )
    .subscribe(([ networks, account ]) => {
      this.networks = networks;
      this.networkOptions = this.networks.map(network => ({
        label: network.name,
        value: network.id
      }));
      if (account) {
        this.account = this.createAccountForm(account);
        this.requestNetworkAccounts(account.keypair.publicKey, account.network);
      }
    });

    this.privateKeySub = this.privateKeyChanged$
      .pipe(
        debounceTime(500)
      )
      .subscribe(() => this.generatePublicKey());
  }

  ngOnDestroy(): void {
    this.privateKeySub.unsubscribe();
  }

  generatePublicKey(): void {
    Keypairs.makePublicKey(this.account.keypair)
      .then(keypair => this.account.keypair = keypair);
  }

  onNetworkSelect(networkOption: ISelectOption): void {
    const network = this.networks.find(n => n.id === networkOption.value);
    this.requestNetworkAccounts(this.account.keypair.publicKey, network);
  }

  onSave(): void {
    const data = this.form.value;
    const updatedAccount = {
      id: this.accountId,
      name: data.name,
      keypair: {
        privateKey: data.privateKey,
        publicKey: data.publicKey
      },
      network: this.networks.find(n => n.id === data.network.value),
      accounts: this.accounts.filter(a => data.account.find(na => na.value === this.getAccountName(a)))
    };
    if (this.accountId) {
      this.accountService.update(updatedAccount.id, updatedAccount);
    } else {
      this.accountService.save(updatedAccount);
    }

    this.router.navigateByUrl(this.pageConfig.backLink);
  }

  onPrivateKeyChanged(): void {
    this.privateKeyChanged$.next();
  }

  onDeleteAccount(accountOption: ISelectOption): void {
    const control = this.form.controls['account'];
    this.account.accounts = control.value.filter(na => na.value !== accountOption.value);
    control.setValue(this.account.accounts);
  }

  private getAccountName(account: INetworkAccount): string {
    return `${account.name}@${account.authority}`;
  }

  private createAccountForm(account: IAccount): IAccountForm {
    return {
      ...account,
      network: {
        label: account.network.name,
        value: account.network.id
      },
      accounts: account.accounts.map(a => ({
        label: this.getAccountName(a),
        value: this.getAccountName(a)
      }))
    };
  }

  private requestNetworkAccounts(key: string, network: INetwork): void {
    this.accountOptions = null;
    this.resetAccountControl();
    this.eosService.getKeyAccounts(network, key)
      .pipe(first())
      .subscribe(accounts => {
        this.accounts = accounts;
        this.accountOptions = this.accounts.map(account => ({
          label: this.getAccountName(account),
          value: this.getAccountName(account),
        }));
      });
  }

  private get accountId(): string {
    return this.route.snapshot.params.id;
  }

  private resetAccountControl(): void {
    const control = this.form.controls['account'];
    if (control) {
      control.setValue('');
    }
  }
}
