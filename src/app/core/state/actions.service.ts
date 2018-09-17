import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';

import { IAppState, SafeAction } from './state.interface';

export abstract class AbstractActionService {

  protected abstract actions: Actions;
  protected abstract store: Store<IAppState>;

  dispatchAction<T>(type: string, payload: T = null): void {
    const action: SafeAction<T> = { type, payload };
    return this.store.dispatch<SafeAction<T>>(action);
  }

  getAction(action: string): Observable<any> {
    return this.actions
      .pipe(
        ofType(action)
      );
  }

  getPayload<T>(type: string): Observable<T> {
    return this.actions
      .pipe(
        ofType(type),
        map((action: SafeAction<T>) => action.payload)
      );
  }
}
