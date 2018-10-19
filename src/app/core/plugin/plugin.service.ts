import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/internal/Observable';
import { from } from 'rxjs/internal/observable/from';
import { flatMap, map } from 'rxjs/internal/operators';

import { IAppState } from '../state/state.interface';
import { IFile } from '../../shared/form/file/file.interface';

import { AbstractStateService } from '../state/state.service';

import { ExtensionMessageType } from '../message/message.interface';

import { Plugins } from './plugin';
import { Encryption } from '../encryption/encryption';
import { Browser } from '../browser/browser';

@Injectable()
export class PluginService extends AbstractStateService {

  constructor(
    protected actions: Actions,
    protected store: Store<IAppState>,
  ) {
    super();
  }

  export(password: string): Observable<Blob> {
    return from(Encryption.generateMnemonic(password))
      .pipe(
        flatMap(([ mnemonic, seed ]) => Browser.stream.send({ type: ExtensionMessageType.EXPORT_PLUGIN, payload: { seed } })),
        map(exportData => Plugins.createBlob(exportData))
      );
  }

  import(password: string, file: IFile): Observable<boolean> {
    return from(Browser.stream.send({ type: ExtensionMessageType.IMPORT_PLUGIN, payload: { password, file } }))
      .pipe(
        map(plugin => {
          if (plugin) {
            this.dispatchAction(Plugins.PLUGIN_STORE, plugin);
            return true;
          } else {
            return false;
          }
        })
      );
  }
}
