import { Component, forwardRef, Inject, ViewChild, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import { Router } from '@angular/router';
import { filter, first, map, flatMap, catchError, distinctUntilChanged, skip } from 'rxjs/internal/operators';

import { INetworkAccountInfo } from '../../../core/eos/eos.interface';

import { AccountService } from '../../../core/account/account.service';
import { SendService } from './send.service';
import { EOSService } from '../../../core/eos/eos.service';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { UIService } from '../../../core/ui/ui.service';

import { AbstractPageComponent } from '../../../layout/page/page.interface';
import { PageLayoutComponent } from '../../../layout/page/page.component';

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: [ './send.component.scss' ],
})
export class SendComponent extends AbstractPageComponent implements OnInit, AfterViewInit, OnDestroy {
  static PATH_CONFIRM = '/app/home/send/confirm';
  static PATH_HOME = '/app/home';

  @ViewChild('form') form: FormGroup;

  accountInfo: INetworkAccountInfo = {};

  symbols = [];

  private signatureSub: Subscription;
  private symbolsSub: Subscription;
  private accountSub: Subscription;
  private formSub: Subscription;

  constructor(
    @Inject(forwardRef(() => PageLayoutComponent)) pageLayout: PageLayoutComponent,
    private sendService: SendService,
    private router: Router,
    private accountService: AccountService,
    private eosService: EOSService,
    private dialogService: DialogService,
    private uiService: UIService
  ) {
    super(pageLayout, {
      backLink: '/app/home',
      header: 'routes.dashboard.send.title',
      footer: 'routes.dashboard.send.send',
      action: () => this.onSend(),
      disabled: () => this.form.invalid
    });
  }

  readonly selectedNetworkAccountName$ = this.accountService.selectedAccount$
    .pipe(
      map(a => a && a.accounts.find(na => na.selected)),
      map(na => na && na.name)
    );

  ngOnInit(): void {
    this.signatureSub = this.sendService.signature$
      .pipe(
        filter(Boolean)
      )
      .subscribe(() => this.router.navigateByUrl(SendComponent.PATH_CONFIRM));

    this.eosService.accountInfo$
      .pipe(
        first()
      )
      .subscribe(info => this.accountInfo = info);

    this.symbolsSub = this.eosService.symbols$
      .subscribe(symbols => this.symbols = symbols);

    this.accountSub = this.accountService.selectedAccount$
      .pipe(
        distinctUntilChanged((a, b) => b && a.id === b.id),
        skip(1)
      )
      .subscribe(() => this.router.navigateByUrl(SendComponent.PATH_HOME));
  }

  ngAfterViewInit(): void {
    this.restoreUIState();
  }

  ngOnDestroy(): void {
    this.destroyUIState();
    this.signatureSub.unsubscribe();
    this.symbolsSub.unsubscribe();
    this.accountSub.unsubscribe();
    if (this.formSub) {
      this.formSub.unsubscribe();
    }
  }

  filterSymbols(key: string): string[] {
    return this.symbols.filter(symbol => symbol.toUpperCase().indexOf(key) !== -1);
  }

  autocomplete = key => this.filterSymbols(key);

  onSend(): void {
    this.sendService.send(this.form.value)
      .pipe(
        flatMap(() => this.dialogService.info('routes.dashboard.send.successMessage')),
        catchError(err => this.dialogService.error(
          'routes.dashboard.send.errorMessage',
          typeof err === 'string'
            ? err
            : JSON.stringify(err)
        ))
      )
      .subscribe(() => this.router.navigateByUrl(SendComponent.PATH_HOME));
  }

  private initUIStateHandler(): void {
    this.formSub = this.form.valueChanges
      .subscribe(value => {
        this.uiService.setState('send', value);
      });
  }

  private restoreUIState(): void {
    setTimeout(() => {
      this.uiService.getState('send')
        .pipe(
          first()
        )
        .subscribe(value => {
          if (value) {
            this.form.setValue(value);
          }
          this.initUIStateHandler();
        });
    });
  }

  private destroyUIState(): void {
    this.uiService.setState('send', null);
  }
}
