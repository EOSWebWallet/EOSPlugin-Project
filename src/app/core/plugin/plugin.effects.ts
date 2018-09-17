import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, throttleTime, tap } from 'rxjs/operators';
import { from } from 'rxjs/internal/observable/from';
import { of } from 'rxjs/internal/observable/of';
import { defer } from 'rxjs/internal/observable/defer';

import { StorageService } from '../storage/storage.service';
import { Encrypt } from '../encrypt/encrypt';
import { IPlugin } from '../plugin/plugin.interface';
import { UnsafeAction } from '../state/state.interface';
import { ExtensionMessageType } from '../message/message.interface';

import { AuthService } from '../auth/auth.service';
import { ExtensionMessageService } from '../message/message.service';
import { PluginService } from '../plugin/plugin.service';

@Injectable()
export class PluginEffects {

  @Effect()
  createPlugin$ = this.actions.pipe(
    ofType(AuthService.AUTH_REGISTER_SUCCESS),
    switchMap(() => {
      return of(PluginService.createPlugin(true))
        .pipe(
          map(plugin => ({
            type: PluginService.PLUGIN_STORE,
            payload: plugin
          }))
        );
    }),
  );

  @Effect()
  storePlugin$ = this.actions.pipe(
    ofType(PluginService.PLUGIN_STORE),
    switchMap((action: UnsafeAction) => {
      return from(this.messageService.send({ type: ExtensionMessageType.STORE_PLUGIN, payload: action.payload }))
        .pipe(
          map(() => ({
            type: PluginService.PLUGIN_STORE_SUCCESS,
            payload: action.payload
          }))
        );
    })
  );

  @Effect()
  loadPlugin$ = this.actions.pipe(
    ofType(PluginService.PLUGIN_LOAD),
    switchMap((action: UnsafeAction) => {
      return from(this.messageService.send({ type: ExtensionMessageType.LOAD_PLUGIN }))
        .pipe(
          map(plugin => ({
            type: PluginService.PLUGIN_LOAD_SUCCESS,
            payload: PluginService.fromJson(plugin)
          }))
        );
    })
  );

  @Effect()
  init$ = defer(() => of({
    type: PluginService.PLUGIN_LOAD,
  }));

  constructor(
    private actions: Actions,
    private messageService: ExtensionMessageService,
  ) {}
}
