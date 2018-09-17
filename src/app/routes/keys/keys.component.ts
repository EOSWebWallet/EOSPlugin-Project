import { Component, ViewChildren, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

import { IControlErrors } from '../../shared/form/form.interface';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-keys',
  templateUrl: './keys.component.html',
})
export class KeysComponent {


  constructor(
    private router: Router,
  ) { }


}
