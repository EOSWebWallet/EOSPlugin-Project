import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { IInfoDialogData } from './info-dialog.interface';

@Component({
  selector: 'app-info-dialog',
  templateUrl: 'info-dialog.component.html',
})
export class InfoDialogComponent {

  constructor(
    private dialogRef: MatDialogRef<InfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IInfoDialogData
  ) { }

  onClose(): void {
    this.dialogRef.close();
  }
}
