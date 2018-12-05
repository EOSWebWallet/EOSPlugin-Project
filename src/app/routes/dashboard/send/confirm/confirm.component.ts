import { Component, forwardRef, Inject, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { FormGroup } from '@angular/forms';
import { first, filter, map } from 'rxjs/operators';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';

import { ITransactionInfo } from './confirm.interface';
import { INetworkAccountInfo } from '../../../../core/eos/eos.interface';

import { SendService } from '../send.service';
import { EOSService } from '../../../../core/eos/eos.service';
import { UIService } from 'src/app/core/ui/ui.service';

import { AbstractPageComponent } from '../../../../layout/page/page.interface';
import { PageLayoutComponent } from '../../../../layout/page/page.component';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: [ './confirm.component.scss' ],
})
export class ConfirmComponent extends AbstractPageComponent implements OnInit, OnDestroy {

  @ViewChild('form') form: FormGroup;

  courseUSD: number;

  accountInfo: INetworkAccountInfo = {};

  transaction: ITransactionInfo;

  private routerSub: Subscription;

  constructor(
    @Inject(forwardRef(() => PageLayoutComponent)) pageLayout: PageLayoutComponent,
    private sendService: SendService,
    private eosService: EOSService,
    private uiService: UIService,
    private router: Router,
    private route: ActivatedRoute
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

    this.routerSub = this.router.events
      .pipe(
        filter(e => e instanceof NavigationStart),
        map(e => <NavigationStart>e),
        filter(e => e.url.indexOf('send') === -1)
      )
      .subscribe(() => this.destroyUIState());

    this.transaction = this.sendService.signupOptions.signargs.messages[0].data;
  }

  ngOnDestroy(): void {
    this.routerSub.unsubscribe();
  }

  get quantity(): number {
    return parseFloat(this.route.snapshot.queryParams['quantity']);
  }

  get quantityUSD(): number {
    return Number((this.quantity * this.courseUSD).toFixed(3)) || 0;
  }

  get symbol(): string {
    return this.transaction.quantity.split(' ')[1];
  }

  onConfirm(): void {
    this.sendService.signup();
  }

  private destroyUIState(): void {
    this.uiService.setState('send', null);
  }
}
