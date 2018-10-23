import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { IErrorDialogData } from './error-dialog.interface';

@Component({
  selector: 'app-error-dialog',
  templateUrl: 'error-dialog.component.html',
  styleUrls: [ 'error-dialog.component.scss' ]
})
export class ErrorDialogComponent {

  showDescription = false;

  constructor(
    private dialogRef: MatDialogRef<ErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IErrorDialogData
  ) { }
}
