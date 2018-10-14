import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { MatDialog } from '@angular/material/dialog';
import { catchError } from 'rxjs/operators';

import { ConfirmDialogComponent } from './confirm/confirm-dialog.component';
import { InfoDialogComponent } from './info/info-dialog.component';
import { ErrorDialogComponent } from './error/error-dialog.component';

@Injectable()
export class DialogService {

  constructor(
    private dialog: MatDialog
  ) { }

  confirm(message: string): Observable<boolean> {
    return this.dialog.open(ConfirmDialogComponent, {
      width: '240px',
      data: { message }
    })
    .afterClosed();
  }

  info(message: string): Observable<void> {
    return this.dialog.open(InfoDialogComponent, {
      width: '240px',
      data: { message }
    })
    .afterClosed();
  }

  error(message: string, description: string): Observable<void> {
    return this.dialog.open(ErrorDialogComponent, {
      width: '240px',
      data: { message, description }
    })
    .afterClosed();
  }
}
