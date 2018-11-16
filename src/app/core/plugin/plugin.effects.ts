import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, throttleTime, tap, flatMap, first } from 'rxjs/operators';
import { from } from 'rxjs/internal/observable/from';
import { of } from 'rxjs/internal/observable/of';
import { defer } from 'rxjs/internal/observable/defer';

import { IPlugin } from '../plugin/plugin.interface';
import { UnsafeAction } from '../state/state.interface';
import { ExtensionMessageType } from '../message/message.interface';

import { AuthService } from '../auth/auth.service';
import { PluginService } from './plugin.service';

import { Plugins } from '../plugin/plugin';
import { Browser } from '../browser/browser';

@Injectable()
export class PluginEffects {

  @Effect()
  createPlugin$ = this.actions.pipe(
    ofType(AuthService.AUTH_REGISTER_SUCCESS),
    switchMap(() => {
      return of(Plugins.createPlugin(true))
        .pipe(
          map(plugin => ({
            type: Plugins.PLUGIN_STORE,
            payload: plugin
          }))
        );
    }),
  );

  @Effect()
  storePlugin$ = this.actions.pipe(
    ofType(Plugins.PLUGIN_STORE),
    switchMap((action: UnsafeAction) => {
      return from(Browser.stream.send({ type: ExtensionMessageType.STORE_PLUGIN, payload: action.payload }))
        .pipe(
          map(() => ({
            type: Plugins.PLUGIN_LOAD,
          }))
        );
    })
  );

  @Effect()
  storePluginUI$ = this.actions.pipe(
    ofType(Plugins.PLUGIN_STORE_UI),
    switchMap((action: UnsafeAction) => {
      return from(Browser.stream.send({ type: ExtensionMessageType.LOAD_PLUGIN }))
        .pipe(
          map(plugin => Plugins.fromJson(plugin)),
          map(plugin => ({
            type: Plugins.PLUGIN_STORE,
            payload: {
              ...plugin,
              keychain: {
                ...plugin.keychain,
                state: action.payload
              }
            }
          }))
        );
    })
  );

  @Effect()
  loadPlugin$ = this.actions.pipe(
    ofType(Plugins.PLUGIN_LOAD),
    switchMap((action: UnsafeAction) => {
      return from(Browser.stream.send({ type: ExtensionMessageType.LOAD_PLUGIN }))
        .pipe(
          map(plugin => ({
            type: Plugins.PLUGIN_LOAD_SUCCESS,
            payload: Plugins.fromJson(plugin)
          }))
        );
    })
  );

  @Effect()
  importPlugin$ = this.actions.pipe(
    ofType(Plugins.PLUGIN_IMPORT),
    switchMap((action: UnsafeAction) => {
      return from(Browser.stream.send({ type: ExtensionMessageType.IMPORT_PLUGIN, payload: action.payload }))
        .pipe(
          map(plugin => ({
            type: Plugins.PLUGIN_LOAD,
          }))
        );
    })
  );

  @Effect()
  destroyPlugin$ = this.actions.pipe(
    ofType(Plugins.PLUGIN_DESTROY),
    map((action: UnsafeAction) => ({
      type: Plugins.PLUGIN_STORE,
      payload: Plugins.createPlugin()
    }))
  );

  @Effect()
  init$ = defer(() => of({
    type: Plugins.PLUGIN_LOAD,
  }));

  @Effect()
  authorizePlugin$ = this.actions.pipe(
    ofType(AuthService.AUTH_LOGIN_SUCCESS),
    switchMap(() => [{
      type: Plugins.PLUGIN_LOAD
    }, {
      type: Plugins.PLUGIN_STORE_UI,
      payload: null
    }])
  );

  @Effect()
  changeEncryption$ = this.actions.pipe(
    ofType(AuthService.AUTH_PASSWORD_CAHNGE_SUCCESS),
    flatMap(() => this.pluginService.plugin$.pipe(first())),
    map(plugin => ({ type: Plugins.PLUGIN_STORE, payload: plugin }))
  );

  @Effect()
  lock$ = this.actions.pipe(
    ofType(AuthService.AUTH_LOCK),
    switchMap((action: UnsafeAction) => {
      return from(Browser.stream.send({ type: ExtensionMessageType.SET_SEED, payload: '' }))
        .pipe(
          map(() => ({
            type: Plugins.PLUGIN_LOAD,
          }))
        );
    })
  );

  constructor(
    private actions: Actions,
    private pluginService: PluginService
  ) {}
}
