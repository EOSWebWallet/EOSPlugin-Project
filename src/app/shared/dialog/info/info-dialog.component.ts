import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { IDialogData } from '../dialog.interface';

@Component({
  selector: 'app-info-dialog',
  templateUrl: 'info-dialog.component.html',
  styleUrls: [ 'info-dialog.component.scss' ]
})
export class InfoDialogComponent {

  constructor(
    private dialogRef: MatDialogRef<InfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData
  ) { }
}
