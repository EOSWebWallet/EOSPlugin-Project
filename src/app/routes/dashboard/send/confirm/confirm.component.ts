import { Component, forwardRef, Inject, ViewChild, OnInit } from '@angular/core';
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
export class ConfirmComponent extends AbstractPageComponent implements OnInit {
  static PATH_HOME = '/app/home';

  @ViewChild('form') form: FormGroup;

  private signupOptions: ISignupOptions;

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

  ngOnInit(): void {
    this.signupOptions = this.sendService.signature$.value;
  }

  onConfirm(): void {
    const { signup, signargs } = this.signupOptions;
    signup(signargs);
    this.router.navigateByUrl(ConfirmComponent.PATH_HOME);
  }
}
