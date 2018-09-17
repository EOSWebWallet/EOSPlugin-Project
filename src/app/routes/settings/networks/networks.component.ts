import { Component, ViewChildren, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-networks',
  templateUrl: './networks.component.html',
})
export class NetworksComponent {


  constructor(
    private router: Router,
  ) { }



}
