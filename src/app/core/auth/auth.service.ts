import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { map, flatMap } from 'rxjs/operators';

import { EOSPlugin } from '../plugin/plugin';

@Injectable()
export class AuthService implements CanActivate {

  static AUTH_REGISTER = 'AUTH_REGISTER';
  static AUTH_REGISTER_SUCCESS = 'AUTH_REGISTER_SUCCESS';

  constructor(
    private router: Router,
  ) {
    this.router.navigate([ '/registration' ]);
  }

  canActivate(): Observable<boolean> {
    return of(true);
  }
}
