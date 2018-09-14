import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { Store } from '@ngrx/store';
import { of } from 'rxjs/internal/observable/of';
import { map, flatMap } from 'rxjs/operators';

import { EOSPlugin } from '../plugin/plugin';
import { IAppState } from '../state/state.interface';

@Injectable()
export class AuthService implements CanActivate {

  static AUTH_REGISTER = 'AUTH_REGISTER';
  static AUTH_REGISTER_SUCCESS = 'AUTH_REGISTER_SUCCESS';

  constructor(
    private router: Router,
    private store: Store<IAppState>,
  ) {
    this.router.navigate([ '/registration' ]);
  }

  canActivate(): Observable<boolean> {
    return of(true);
  }

  register(password: string): void {
    this.store.dispatch({
      type: AuthService.AUTH_REGISTER,
      payload: password
    });
  }
}
