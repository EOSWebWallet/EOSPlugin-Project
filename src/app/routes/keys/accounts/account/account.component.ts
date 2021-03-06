import { Component, OnInit, OnDestroy, forwardRef, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs/internal/Subject';
import { Subscription } from 'rxjs/internal/Subscription';
import { first, map, debounceTime, flatMap } from 'rxjs/internal/operators';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { of } from 'rxjs/internal/observable/of';
import { from } from 'rxjs/internal/observable/from';

import { IAccount } from '../../../../core/account/account.interface';
import { INetwork, INetworkAccount } from '../../../../core/network/network.interface';
import { ISelectOption } from '../../../../shared/form/select/select.interface';
import { IAccountForm } from './account.interface';

import { AccountService } from '../../../../core/account/account.service';
import { NetworksService } from '../../../../core/network/networks.service';
import { EOSService } from '../../../../core/eos/eos.service';
import { UIService } from '../../../../core/ui/ui.service';

import { AbstractPageComponent } from '../../../../layout/page/page.interface';
import { PageLayoutComponent } from '../../../../layout/page/page.component';

import { Keypairs } from '../../../../core/keypair/keypair';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: [ './account.component.scss' ]
})
export class AccountComponent extends AbstractPageComponent implements OnInit, OnDestroy, AfterViewInit {

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

  private selectedNetworkAccount: INetworkAccount;

  private privateKeyChanged$ = new Subject<void>();
  private privateKeySub: Subscription;
  private accountSub: Subscription;
  private formSub: Subscription;

  constructor(
    @Inject(forwardRef(() => PageLayoutComponent)) pageLayout: PageLayoutComponent,
    private accountService: AccountService,
    private networksService: NetworksService,
    private eosService: EOSService,
    private route: ActivatedRoute,
    private router: Router,
    private uiService: UIService
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
      } else {
        this.account = this.createEmptyForm(this.networkOptions[0]);
      }
    });

    this.accountService.selectedNetworkAccount$
      .pipe(
        first()
      )
      .subscribe(a => this.selectedNetworkAccount = a);
  }

  ngAfterViewInit(): void {
    this.restoreUIState();
  }

  ngOnDestroy(): void {
    this.destroyUIState();
    if (this.privateKeySub) {
      this.privateKeySub.unsubscribe();
    }
    if (this.formSub) {
      this.formSub.unsubscribe();
    }
  }

  onNetworkSelect(networkOption: ISelectOption): void {
    const network = this.networks.find(n => n.id === networkOption.value);
    this.requestNetworkAccounts(this.account.keypair.publicKey, network);
  }

  onSave(): void {
    const data = {
      ...this.form.value,
      publicKey: this.form.controls['publicKey'].value
    };
    const updatedAccount = {
      id: this.accountId,
      name: data.name,
      keypair: {
        privateKey: data.privateKey,
        publicKey: data.publicKey
      },
      network: this.networks.find(n => n.id === data.network.value),
      accounts: this.accounts
        .filter(a => data.account.find(na => na.value === this.getAccountName(a)))
        .map((a, i) => ({ ...a, selected: !this.selectedNetworkAccount && i === 0 }))
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

  private createEmptyForm(defaultNetwork: ISelectOption): IAccountForm {
    return {
      keypair: {},
      network: defaultNetwork
    } as IAccountForm;
  }

  private requestNetworkAccounts(key: string, network: INetwork): void {
    this.accountOptions = null;
    this.resetAccountControl();
    if (key) {
      if (this.accountSub) {
        this.accountSub.unsubscribe();
        this.accountSub = null;
      }
      this.accountSub = this.eosService.getKeyAccounts(network, key)
        .pipe(first())
        .subscribe(accounts => {
          this.accounts = accounts;
          this.accountOptions = this.accounts.map(account => ({
            label: this.getAccountName(account),
            value: this.getAccountName(account),
          }));
        });
    } else {
      this.accountOptions = [];
    }
  }

  private get accountId(): string {
    return this.route.snapshot.params.id;
  }

  private resetAccountControl(): void {
    const control = this.form.controls['account'];
    if (control) {
      control.setValue([]);
    }
  }

  private initPrivateKeyHandler(): void {
    this.privateKeySub = this.privateKeyChanged$
      .pipe(
        debounceTime(500),
        flatMap(() => from(Keypairs.makePublicKey(this.account.keypair))),
      )
      .subscribe(keypair => {
        if (this.account.keypair.publicKey !== keypair.publicKey || !this.accountOptions.length) {
          const networkOption = this.form.controls['network'].value;
          if (networkOption) {
            const network = this.networks.find(n => n.id === networkOption.value);
            this.requestNetworkAccounts(keypair.publicKey, network);
          }
        }
        this.account.keypair = keypair;
      });
  }

  private initUIStateHandler(): void {
    this.formSub = this.form.valueChanges
      .subscribe(value => {
        this.uiService.setState('accountForm', {
          ...value,
          ...(
            this.form.controls['publicKey']
              ? { publicKey: this.form.controls['publicKey'].value }
              : { }
          )
        });
      });
  }

  private restoreUIState(): void {
    setTimeout(() => {
      this.uiService.getState('accountForm')
        .pipe(
          first()
        )
        .subscribe(value => {
          if (value) {
            if (value.network && value.publicKey) {
              const network = this.networks.find(n => n.id === value.network.value);
              this.requestNetworkAccounts(value.publicKey, network);
            }
            Object.keys(this.form.controls)
              .forEach(control => this.form.controls[control].setValue(value[control]));
          }
          this.initUIStateHandler();
          this.initPrivateKeyHandler();
          if (value && value.privateKey && !value.publicKey) {
            this.privateKeyChanged$.next();
          }
        });
    });
  }

  private destroyUIState(): void {
    this.uiService.setState('accountForm', null);
  }
}
