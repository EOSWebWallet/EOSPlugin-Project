import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, switchMap, tap, flatMap, filter, withLatestFrom } from 'rxjs/operators';
import { from } from 'rxjs/internal/observable/from';

import { EncryptUtils } from '../encrypt/encrypt.utils';
import { IPlugin } from '../plugin/plugin.interface';
import { UnsafeAction } from '../state/state.interface';
import { ExtensionMessageType } from '../message/message.interface';

import { AuthService } from './auth.service';
import { ExtensionMessageService } from '../message/message.service';
import { PluginUtils } from '../plugin/plugin.utils';
import { StorageUtils } from '../storage/storage.service';

@Injectable()
export class AuthEffects {

  @Effect()
  register$ = this.actions.pipe(
    ofType(AuthService.AUTH_REGISTER),
    switchMap((action: UnsafeAction) => {
      return from(StorageUtils.setSalt(EncryptUtils.insecureHash(EncryptUtils.text(32))))
        .pipe(
          flatMap(() => from(EncryptUtils.generateMnemonic(action.payload))),
          flatMap(([ mnemonic, seed ]) => from(ExtensionMessageService.send({ type: ExtensionMessageType.SET_SEED, payload: seed }))),
          map(() => ({
            type: AuthService.AUTH_REGISTER_SUCCESS,
            payload: action.payload
          }))
        );
    })
  );

  @Effect()
  changePassword$ = this.actions.pipe(
    ofType(AuthService.AUTH_PASSWORD_CAHNGE),
    switchMap((action: UnsafeAction) => {
      return from(EncryptUtils.generateMnemonic(action.payload.password))
        .pipe(
          tap(() => from(StorageUtils.setSalt(EncryptUtils.insecureHash(EncryptUtils.text(32))))),
          flatMap(([ mnemonic, seed ]) =>
            from(EncryptUtils.generateMnemonic(action.payload.newPassword))
              .pipe(
                map(( [ newMnemonic, newSeed ]) => [ seed, newSeed ])
              )
          ),
          flatMap(([ seed, newSeed ]) =>
            from(ExtensionMessageService.send({ type: ExtensionMessageType.CHANGE_SEED, payload: { seed, newSeed } }))
          ),
          map(() => ({
            type: AuthService.AUTH_PASSWORD_CAHNGE_SUCCESS,
            payload: action.payload
          }))
        );
    })
  );

  @Effect()
  login$ = this.actions.pipe(
    ofType(AuthService.AUTH_LOGIN),
    switchMap((action: UnsafeAction) => {
      return from(EncryptUtils.generateMnemonic(action.payload))
        .pipe(
          flatMap(([ mnemonic, seed ]) => from(ExtensionMessageService.send({ type: ExtensionMessageType.SET_SEED, payload: seed }))),
          flatMap(() => this.authService.isAuthorized),
          filter(Boolean),
          map(() => ({
            type: AuthService.AUTH_LOGIN_SUCCESS,
            payload: action.payload
          }))
        );
    })
  );

  constructor(
    private actions: Actions,
    private authService: AuthService
  ) {}
}
