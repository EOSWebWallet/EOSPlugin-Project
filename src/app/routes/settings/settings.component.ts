import { Component, ViewChildren, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent {

  constructor(
    private router: Router,
  ) { }
}
