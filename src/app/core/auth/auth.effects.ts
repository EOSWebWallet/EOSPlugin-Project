import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, throttleTime, tap, flatMap } from 'rxjs/operators';
import { from } from 'rxjs/internal/observable/from';

import { Encrypt } from '../encrypt/encrypt';
import { IPlugin } from '../plugin/plugin.interface';
import { UnsafeAction } from '../state/state.interface';
import { ExtensionMessageType } from '../message/message.interface';

import { AuthService } from './auth.service';
import { ExtensionMessageService } from '../message/message.service';
import { PluginService } from '../plugin/plugin.service';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class AuthEffects {

  @Effect()
  register$ = this.actions.pipe(
    ofType(AuthService.AUTH_REGISTER),
    switchMap((action: UnsafeAction) => {
      return from(StorageService.setSalt(Encrypt.insecureHash(Encrypt.text(32))))
        .pipe(
          flatMap(() => from(Encrypt.generateMnemonic(action.payload))),
          flatMap(([ mnemonic, seed ]) => this.messageService.send({ type: ExtensionMessageType.SET_SEED, payload: seed })),
          map(() => ({
            type: AuthService.AUTH_REGISTER_SUCCESS,
            payload: action.payload
          }))
        );
    })
  );

  constructor(
    private actions: Actions,
    private messageService: ExtensionMessageService,
  ) {}
}
