import { Component } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators';

import { IAccount, IAccountFields } from '../../core/account/account.interface';

import { PromptService } from '../prompt.service';

import { AccountService } from '../../core/account/account.service';
import { AccountUtils } from '../../core/account/account.utils';

@Component({
  selector: 'app-prompt-identity',
  templateUrl: './identity.component.html',
})
export class IdentityComponent {

  constructor(
    private accountService: AccountService,
    private promptService: PromptService
  ) { }

  get requirements(): IAccountFields {
    return this.promptService.prompt.requirements;
  }

  get accounts$(): Observable<IAccount[]> {
    return this.accountService.accounts$
      .pipe(
        map(accounts => accounts.filter(a => AccountUtils.hasRequirements(a, this.requirements)))
      );
  }
}
