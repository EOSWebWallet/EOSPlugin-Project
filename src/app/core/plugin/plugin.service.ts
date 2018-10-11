import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/internal/Observable';
import { from } from 'rxjs/internal/observable/from';
import { flatMap, map } from 'rxjs/internal/operators';

import { IAppState } from '../state/state.interface';
import { IFile } from '../../shared/form/file/file.interface';

import { AbstractStateService } from '../state/state.service';
import { ExtensionMessageService } from '../message/message.service';

import { ExtensionMessageType } from '../message/message.interface';

import { PluginUtils } from './plugin.utils';
import { EncryptUtils } from '../encrypt/encrypt.utils';

@Injectable()
export class PluginService extends AbstractStateService {

  constructor(
    protected actions: Actions,
    protected store: Store<IAppState>,
  ) {
    super();
  }

  export(password: string): Observable<Blob> {
    return from(EncryptUtils.generateMnemonic(password))
      .pipe(
        flatMap(([ mnemonic, seed ]) => ExtensionMessageService.send({ type: ExtensionMessageType.EXPORT_PLUGIN, payload: { seed } })),
        map(exportData => PluginUtils.createBlob(exportData))
      );
  }

  import(password: string, file: IFile): Observable<boolean> {
    return from(EncryptUtils.generateMnemonic(password))
      .pipe(
        flatMap(([ mnemonic, seed ]) =>
          from(ExtensionMessageService.send({ type: ExtensionMessageType.IMPORT_PLUGIN, payload: { seed, file } }))
        ),
        map(plugin => {
          if (plugin) {
            this.dispatchAction(PluginUtils.PLUGIN_STORE, plugin);
            return true;
          } else {
            return false;
          }
        })
      );
  }
}
