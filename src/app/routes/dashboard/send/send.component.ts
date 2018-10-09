import { Component, forwardRef, Inject, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { SendService } from './send.service';

import { AbstractPageComponent } from '../../../layout/page/page.interface';
import { PageLayoutComponent } from '../../../layout/page/page.component';

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: [ './send.component.scss' ],
})
export class SendComponent extends AbstractPageComponent {

  @ViewChild('form') form: FormGroup;

  constructor(
    @Inject(forwardRef(() => PageLayoutComponent)) pageLayout: PageLayoutComponent,
    private sendService: SendService,
  ) {
    super(pageLayout, {
      backLink: '/app/home',
      header: 'routes.dashboard.send.title',
      footer: 'routes.dashboard.send.send',
      action: () => this.onSend(),
      disabled: () => this.form.invalid
    });
  }

  onSend(): void {
    this.sendService.send(this.form.value);
  }
}
