import { Component, forwardRef, Inject, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { SendService } from '../send.service';
import { ISignupOptions } from '../send.interface';

import { AbstractPageComponent } from '../../../../layout/page/page.interface';
import { PageLayoutComponent } from '../../../../layout/page/page.component';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: [ './confirm.component.scss' ],
})
export class ConfirmComponent extends AbstractPageComponent {
  static PATH_HOME = '/app/home';

  @ViewChild('form') form: FormGroup;

  constructor(
    @Inject(forwardRef(() => PageLayoutComponent)) pageLayout: PageLayoutComponent,
    private sendService: SendService,
    private router: Router
  ) {
    super(pageLayout, {
      backLink: '/app/home/send',
      header: 'routes.dashboard.send.confirm.title',
      footer: 'routes.dashboard.send.confirm.confirm',
      action: () => this.onConfirm(),
    });
  }

  onConfirm(): void {
    this.sendService.signup();
    this.router.navigateByUrl(ConfirmComponent.PATH_HOME);
  }
}
