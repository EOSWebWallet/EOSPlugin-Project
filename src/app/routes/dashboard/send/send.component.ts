import { Component, forwardRef, Inject, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import { Router } from '@angular/router';
import { filter, first, map, flatMap, catchError } from 'rxjs/internal/operators';

import { INetworkAccountInfo } from '../../../core/eos/eos.interface';

import { AccountService } from '../../../core/account/account.service';
import { SendService } from './send.service';
import { EOSService } from '../../../core/eos/eos.service';
import { DialogService } from '../../../shared/dialog/dialog.service';

import { AbstractPageComponent } from '../../../layout/page/page.interface';
import { PageLayoutComponent } from '../../../layout/page/page.component';

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: [ './send.component.scss' ],
})
export class SendComponent extends AbstractPageComponent implements OnInit, OnDestroy {
  static PATH_CONFIRM = '/app/home/send/confirm';
  static PATH_HOME = '/app/home';

  @ViewChild('form') form: FormGroup;

  accountInfo: INetworkAccountInfo = {};

  private signatureSub: Subscription;

  constructor(
    @Inject(forwardRef(() => PageLayoutComponent)) pageLayout: PageLayoutComponent,
    private sendService: SendService,
    private router: Router,
    private accountService: AccountService,
    private eosService: EOSService,
    private dialogService: DialogService
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
      map(a => a.accounts.find(na => na.selected)),
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
  }

  ngOnDestroy(): void {
    this.signatureSub.unsubscribe();
  }

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
}
