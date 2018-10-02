import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ConfirmDialogComponent } from '../../shared/dialog/confirm/confirm-dialog.component';
import { AccountUtils } from '../../core/account/account.utils';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {

  constructor(public dialog: MatDialog) {
  }

  openDialog(): void {
    // const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    //   width: '250px',
    //   data: { message: 'Everything is ok)' }
    // });

    AccountUtils.getIdentity([
      {
        name: 'Account One',
        keypair: {
          privateKey: null,
          publicKey: 'FDSFFJKO34J89R9834JHF934JHF349JHF934JF9234NF9834N9348'
        },
        network: {
          name: 'Network One',
          host: 'jungle.eos.smartz.net',
          port: 443
        },
        accounts: [
          { name: 'network account 1', authority: 'active' },
          { name: 'network account 1', authority: 'owner' },
          { name: 'network account 2', authority: 'owner' },
          { name: 'network account 3', authority: 'owner' },
          { name: 'network account 4', authority: 'owner' },
          { name: 'network account 5', authority: 'owner' },
        ]
      }
    ], () => {
    });
  }

  onSubmit(form: any): void {
  }
}
