import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/internal/Observable';
import { from } from 'rxjs/internal/observable/from';
import { flatMap } from 'rxjs/internal/operators';

import { IAppState } from '../state/state.interface';
import { IFile } from '../../shared/form/file/file.interface';

import { AbstractActionService } from '../state/actions.service';
import { ExtensionMessageService } from '../message/message.service';

import { ExtensionMessageType } from '../message/message.interface';

import { PluginUtils } from './plugin.utils';
import { EncryptUtils } from '../encrypt/encrypt.utils';

@Injectable()
export class PluginService extends AbstractActionService {

  constructor(
    protected actions: Actions,
    protected store: Store<IAppState>,
  ) {
    super();
  }

  export(password: string): Observable<Blob> {
    return from(EncryptUtils.generateMnemonic(password))
      .pipe(
        flatMap(([ mnemonic, seed ]) => ExtensionMessageService.send({ type: ExtensionMessageType.EXPORT_PLUGIN, payload: { seed } }))
      );
  }

  import(password: string, file: IFile): void {
    EncryptUtils.generateMnemonic(password)
      .then(([ mnemonic, seed ]) => this.dispatchAction(PluginUtils.PLUGIN_IMPORT, { seed, file }));
  }
}
