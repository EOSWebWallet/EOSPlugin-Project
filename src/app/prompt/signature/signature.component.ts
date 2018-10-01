import { Component } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map, first } from 'rxjs/internal/operators';

import { IAccount, IAccountFields } from '../../core/account/account.interface';
import { INetworkAccount } from '../../core/network/network.interface';

import { PromptService } from '../prompt.service';
import { AccountService } from '../../core/account/account.service';

import { AccountUtils } from '../../core/account/account.utils';
import { NotificationUtils } from '../../core/notification/notification.utils';

@Component({
  selector: 'app-prompt-signature',
  templateUrl: './signature.component.html',
})
export class SignatureComponent {

  constructor(
    private accountService: AccountService,
    private promptService: PromptService,
  ) { }

  get requirements(): IAccountFields {
    return this.promptService.prompt.requirements;
  }

  onAccept(): void {
    this.promptService.prompt.responder({
      accepted: true,
    });
    NotificationUtils.close();
  }
}
