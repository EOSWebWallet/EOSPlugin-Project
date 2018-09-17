import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { Store } from '@ngrx/store';
import { of } from 'rxjs/internal/observable/of';
import { map, flatMap } from 'rxjs/operators';

import { IPlugin } from '../plugin/plugin.interface';
import { IAppState } from '../state/state.interface';
import { ExtensionMessageType } from '../message/message.interface';

import { AbstractActionService } from '../state/actions.service';
import { ExtensionMessageService } from '../message/message.service';

@Injectable()
export class AuthService extends AbstractActionService implements CanActivate {

  static PATH_HOME = '/app/home';

  static AUTH_REGISTER = 'AUTH_REGISTER';
  static AUTH_REGISTER_SUCCESS = 'AUTH_REGISTER_SUCCESS';

  constructor(
    protected actions: Actions,
    private router: Router,
    protected store: Store<IAppState>,
    private messageService: ExtensionMessageService
  ) {
    super();
    this.router.navigate([ '/registration' ]);
    this.getAction(AuthService.AUTH_REGISTER_SUCCESS)
      .subscribe(() => this.router.navigateByUrl(AuthService.PATH_HOME));
  }

  canActivate(): Observable<boolean> {
    return this.messageService.send({ type: ExtensionMessageType.IS_AUTHORIZED });
  }

  register(password: string): void {
    this.store.dispatch({
      type: AuthService.AUTH_REGISTER,
      payload: password
    });
  }
}
