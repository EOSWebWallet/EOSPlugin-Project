import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { Store, select } from '@ngrx/store';
import { of } from 'rxjs/internal/observable/of';
import { map, flatMap, first, filter } from 'rxjs/operators';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';

import { IPlugin } from '../plugin/plugin.interface';
import { IAppState } from '../state/state.interface';
import { ExtensionMessageType } from '../message/message.interface';

import { AbstractActionService } from '../state/actions.service';
import { ExtensionMessageService } from '../message/message.service';

@Injectable()
export class AuthService extends AbstractActionService implements CanActivate {

  static PATH_HOME = '/app/home';
  static PATH_LOGIN = '/login';
  static PATH_REGISTER = '/registration';

  static AUTH_REGISTER = 'AUTH_REGISTER';
  static AUTH_REGISTER_SUCCESS = 'AUTH_REGISTER_SUCCESS';
  static AUTH_LOGIN = 'AUTH_LOGIN';
  static AUTH_LOGIN_SUCCESS = 'AUTH_LOGIN_SUCCESS';

  constructor(
    protected actions: Actions,
    private router: Router,
    protected store: Store<IAppState>,
    private messageService: ExtensionMessageService
  ) {
    super();

    this.navigateToInitialRoute();

    this.navigateAfterRegistration();
    this.navigateAfterLogin();
  }

  get isAuthorized(): Observable<boolean> {
    return this.messageService.send({ type: ExtensionMessageType.IS_AUTHORIZED });
  }

  get hasAuthorization(): Observable<boolean> {
    return this.store
      .pipe(
        select(state => state.plugin && state.plugin),
        filter(({ plugin }) => !!plugin),
        map(({ plugin }) => plugin.hasEncryptionKey)
      );
  }

  canActivate(): Observable<boolean> {
    return this.isAuthorized;
  }

  register(password: string): void {
    this.store.dispatch({
      type: AuthService.AUTH_REGISTER,
      payload: password
    });
  }

  login(password: string): void {
    this.store.dispatch({
      type: AuthService.AUTH_LOGIN,
      payload: password
    });
  }

  private navigateToInitialRoute(): void {
    combineLatest(
      this.hasAuthorization,
      this.isAuthorized
    )
    .pipe(first())
    .subscribe(([ hasAuthorization, isAuthorized ]) => {
      if (!hasAuthorization) {
        this.router.navigateByUrl(AuthService.PATH_REGISTER);
      } else if (hasAuthorization && !isAuthorized) {
        this.router.navigateByUrl(AuthService.PATH_LOGIN);
      } else {
        this.router.navigateByUrl(AuthService.PATH_HOME);
      }
    });
  }

  private navigateAfterRegistration(): void {
    this.getAction(AuthService.AUTH_REGISTER_SUCCESS)
      .subscribe(() => this.router.navigateByUrl(AuthService.PATH_HOME));
  }

  private navigateAfterLogin(): void {
    this.getAction(AuthService.AUTH_LOGIN_SUCCESS)
      .subscribe(() => this.router.navigateByUrl(AuthService.PATH_HOME));
  }
}
