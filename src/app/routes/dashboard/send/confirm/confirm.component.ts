import { Component, forwardRef, Inject, ViewChild, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { first, map } from 'rxjs/operators';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';

import { ISignupOptions } from '../send.interface';
import { ITransactionInfo } from './confirm.interface';
import { INetworkAccountInfo } from '../../../../core/eos/eos.interface';

import { SendService } from '../send.service';
import { EOSService } from '../../../../core/eos/eos.service';

import { AbstractPageComponent } from '../../../../layout/page/page.interface';
import { PageLayoutComponent } from '../../../../layout/page/page.component';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: [ './confirm.component.scss' ],
})
export class ConfirmComponent extends AbstractPageComponent implements OnInit {

  @ViewChild('form') form: FormGroup;

  courseUSD: number;

  accountInfo: INetworkAccountInfo = {};

  constructor(
    @Inject(forwardRef(() => PageLayoutComponent)) pageLayout: PageLayoutComponent,
    private sendService: SendService,
    private eosService: EOSService,
    private router: Router
  ) {
    super(pageLayout, {
      backLink: '/app/home/send',
      header: 'routes.dashboard.send.confirm.title',
      footer: 'routes.dashboard.send.confirm.confirm',
      action: () => this.onConfirm(),
      back: () => this.sendService.deny()
    });
  }

  ngOnInit(): void {
    combineLatest(
      this.eosService.courses$,
      this.eosService.accountInfo$
    )
    .pipe(
      first()
    )
    .subscribe(([ courses, info ]) => {
      this.courseUSD = Number(courses.market_data.current_price.usd);
      this.accountInfo = info;
    });
  }

  get transaction(): ITransactionInfo {
    return this.sendService.signupOptions.signargs.messages[0].data;
  }

  get quantity(): number {
    return parseFloat(this.transaction.quantity);
  }

  get quantityUSD(): number {
    return Number((this.quantity * this.courseUSD).toFixed(3));
  }

  get symbol(): string {
    return this.transaction.quantity.split(' ')[1];
  }

  onConfirm(): void {
    this.sendService.signup();
  }
}
