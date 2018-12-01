import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { CanActivate, Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { Store, select } from '@ngrx/store';
import { of } from 'rxjs/internal/observable/of';
import { map, flatMap, first, filter } from 'rxjs/operators';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { from } from 'rxjs/internal/observable/from';

import { IPlugin } from '../plugin/plugin.interface';
import { IAppState } from '../state/state.interface';
import { ExtensionMessageType } from '../message/message.interface';

import { AbstractStateService } from '../state/state.service';

import { Plugins } from '../plugin/plugin';
import { Browser } from '../browser/browser';
import { PluginStorage } from '../storage/storage';

declare var window: any;

@Injectable()
export class AuthService extends AbstractStateService implements CanActivate {

  static PATH_HOME = '/app/home';
  static PATH_PROMPT = '/prompt';
  static PATH_LOGIN = '/login';
  static PATH_REGISTER = '/registration';
  static PATH_CONFIRM = '/app/home/send/confirm';
  static PATH_SEND = '/app/home/send';
  static PATH_APP = '/app';

  static AUTH_REGISTER = 'AUTH_REGISTER';
  static AUTH_REGISTER_SUCCESS = 'AUTH_REGISTER_SUCCESS';
  static AUTH_PASSWORD_CAHNGE = 'AUTH_PASSWORD_CAHNGE';
  static AUTH_PASSWORD_CAHNGE_SUCCESS = 'AUTH_PASSWORD_CAHNGE_SUCCESS';
  static AUTH_PASSWORD_CAHNGE_FAILURE = 'AUTH_PASSWORD_CAHNGE_FAILURE';
  static AUTH_LOGIN = 'AUTH_LOGIN';
  static AUTH_LOGIN_SUCCESS = 'AUTH_LOGIN_SUCCESS';
  static AUTH_LOCK = 'AUTH_LOCK';

  constructor(
    protected actions: Actions,
    private router: Router,
    protected store: Store<IAppState>,
  ) {
    super();

    this.navigateToInitialRoute();

    this.navigateAfterRegistration();
    this.navigateAfterLogin();

    this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        map(e => <NavigationEnd>e),
        filter(e => e.url.indexOf(AuthService.PATH_APP) !== -1)
      )
      .subscribe(e => PluginStorage.setRoute(e.url));
  }

  get isAuthorized(): Observable<boolean> {
    return from(Browser.stream.send({ type: ExtensionMessageType.IS_AUTHORIZED }));
  }

  get hasAuthorization(): Observable<boolean> {
    return this.store
      .pipe(
        select(state => state.plugin && state.plugin),
        filter(({ plugin }) => !!plugin),
        map(({ plugin }) => plugin.hasEncryptionKey)
      );
  }

  get passwordChanged(): Observable<void> {
    return this.getAction(AuthService.AUTH_PASSWORD_CAHNGE_SUCCESS);
  }

  get passwordChangedFailure(): Observable<void> {
    return this.getAction(AuthService.AUTH_PASSWORD_CAHNGE_FAILURE);
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

  destroy(): void {
    this.dispatchAction(Plugins.PLUGIN_DESTROY);
  }

  changePassword(password: string, newPassword: string): void {
    this.dispatchAction(AuthService.AUTH_PASSWORD_CAHNGE, { password, newPassword });
  }

  lock(): void {
    this.dispatchAction(AuthService.AUTH_LOCK);
    this.router.navigateByUrl(AuthService.PATH_LOGIN);
  }

  private navigateToInitialRoute(): void {
    combineLatest(
      this.hasAuthorization,
      this.isAuthorized,
      from(PluginStorage.getRoute())
    )
    .pipe(first())
    .subscribe(([ hasAuthorization, isAuthorized, route ]) => {
      if (!hasAuthorization) {
        this.router.navigateByUrl(AuthService.PATH_REGISTER);
      } else if (hasAuthorization && !isAuthorized) {
        this.router.navigateByUrl(AuthService.PATH_LOGIN);
      } else if (window.isPrompt) {
        this.router.navigateByUrl(AuthService.PATH_PROMPT);
      } else {
        const finalRoute = (route || '').indexOf(AuthService.PATH_CONFIRM) !== -1
          ? `${AuthService.PATH_SEND}?confirm=true`
          : route;
        this.router.navigateByUrl(finalRoute || AuthService.PATH_HOME);
      }
    });
  }

  private navigateAfterRegistration(): void {
    this.getAction(AuthService.AUTH_REGISTER_SUCCESS)
      .subscribe(() => {
        if (window.isPrompt) {
          this.router.navigateByUrl(AuthService.PATH_PROMPT);
        } else {
          this.router.navigateByUrl(AuthService.PATH_HOME);
        }
      });
  }

  private navigateAfterLogin(): void {
    this.getAction(AuthService.AUTH_LOGIN_SUCCESS)
      .subscribe(() => {
        if (window.isPrompt) {
          this.router.navigateByUrl(AuthService.PATH_PROMPT);
        } else {
          this.router.navigateByUrl(AuthService.PATH_HOME);
        }
      });
  }
}
