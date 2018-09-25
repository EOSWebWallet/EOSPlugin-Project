import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, throttleTime, tap } from 'rxjs/operators';
import { from } from 'rxjs/internal/observable/from';
import { of } from 'rxjs/internal/observable/of';
import { defer } from 'rxjs/internal/observable/defer';

import { StorageUtils } from '../storage/storage.service';
import { EncryptUtils } from '../encrypt/encrypt.utils';
import { IPlugin } from '../plugin/plugin.interface';
import { UnsafeAction } from '../state/state.interface';
import { ExtensionMessageType } from '../message/message.interface';

import { AuthService } from '../auth/auth.service';
import { ExtensionMessageService } from '../message/message.service';
import { PluginUtils } from '../plugin/plugin.utils';

@Injectable()
export class PluginEffects {

  @Effect()
  createPlugin$ = this.actions.pipe(
    ofType(AuthService.AUTH_REGISTER_SUCCESS),
    switchMap(() => {
      return of(PluginUtils.createPlugin(true))
        .pipe(
          map(plugin => ({
            type: PluginUtils.PLUGIN_STORE,
            payload: plugin
          }))
        );
    }),
  );

  @Effect()
  storePlugin$ = this.actions.pipe(
    ofType(PluginUtils.PLUGIN_STORE),
    switchMap((action: UnsafeAction) => {
      return from(ExtensionMessageService.send({ type: ExtensionMessageType.STORE_PLUGIN, payload: action.payload }))
        .pipe(
          map(() => ({
            type: PluginUtils.PLUGIN_STORE_SUCCESS,
            payload: action.payload
          }))
        );
    })
  );

  @Effect()
  loadPlugin$ = this.actions.pipe(
    ofType(PluginUtils.PLUGIN_LOAD),
    switchMap((action: UnsafeAction) => {
      return from(ExtensionMessageService.send({ type: ExtensionMessageType.LOAD_PLUGIN }))
        .pipe(
          map(plugin => ({
            type: PluginUtils.PLUGIN_LOAD_SUCCESS,
            payload: PluginUtils.fromJson(plugin)
          }))
        );
    })
  );

  @Effect()
  init$ = defer(() => of({
    type: PluginUtils.PLUGIN_LOAD,
  }));

  @Effect()
  authorizePlugin$ = this.actions.pipe(
    ofType(AuthService.AUTH_LOGIN_SUCCESS),
    map(() => ({ type: PluginUtils.PLUGIN_LOAD }))
  );

  constructor(
    private actions: Actions,
  ) {}
}
