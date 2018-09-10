import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { InfoDialogComponent } from '../../shared/dialog/info/info-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {

  constructor(public dialog: MatDialog) {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(InfoDialogComponent, {
      width: '250px',
      data: { message: 'Everything is ok)' }
    });
  }
}
