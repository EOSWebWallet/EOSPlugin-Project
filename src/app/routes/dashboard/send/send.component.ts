import { Component, forwardRef, Inject, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import { Router } from '@angular/router';
import { filter } from 'rxjs/internal/operators';

import { SendService } from './send.service';

import { AbstractPageComponent } from '../../../layout/page/page.interface';
import { PageLayoutComponent } from '../../../layout/page/page.component';

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: [ './send.component.scss' ],
})
export class SendComponent extends AbstractPageComponent implements OnInit, OnDestroy {
  static PATH_CONFIRM = '/app/home/send/confirm';

  @ViewChild('form') form: FormGroup;

  private signatureSub: Subscription;

  constructor(
    @Inject(forwardRef(() => PageLayoutComponent)) pageLayout: PageLayoutComponent,
    private sendService: SendService,
    private router: Router
  ) {
    super(pageLayout, {
      backLink: '/app/home',
      header: 'routes.dashboard.send.title',
      footer: 'routes.dashboard.send.send',
      action: () => this.onSend(),
      disabled: () => this.form.invalid
    });
  }

  ngOnInit(): void {
    this.signatureSub = this.sendService.signature$
      .pipe(
        filter(Boolean)
      )
      .subscribe(() => this.router.navigateByUrl(SendComponent.PATH_CONFIRM));
  }

  ngOnDestroy(): void {
    this.signatureSub.unsubscribe();
  }

  onSend(): void {
    this.sendService.send(this.form.value);
  }
}
