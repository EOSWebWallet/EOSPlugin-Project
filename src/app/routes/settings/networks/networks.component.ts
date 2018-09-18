import { Component, ViewChildren, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';

import { INetwork } from '../../../core/network/network.interface';

import { NetworksService } from '../../../core/network/networks.service';
import { Subscribable, Subscription } from 'rxjs';

import { NetworkUtils } from '../../../core/network/network.utils';

@Component({
  selector: 'app-networks',
  templateUrl: './networks.component.html',
})
export class NetworksComponent implements OnInit, OnDestroy {

  networks: INetwork[];
  editableNetwork: INetwork;

  private networksSub: Subscription;

  constructor(
    private router: Router,
    private networskService: NetworksService,
  ) { }

  ngOnInit(): void {
    this.networksSub = this.networks$.subscribe(networks => this.networks = networks);
  }

  ngOnDestroy(): void {
    this.networksSub.unsubscribe();
  }

  get networks$(): Observable<INetwork[]> {
    return this.networskService.networks$;
  }

  onAdd(): void {
    this.networskService.setNetworks([ ...this.networks, NetworkUtils.createNetwork() ]);
  }

  onSave(): void {
    this.networskService.setNetworks(this.networks);
  }

  onRemove(network: INetwork): void {
    this.networskService.setNetworks(this.networks.filter(n => n !== network));
  }

  onSelect(network: INetwork): void {
    this.networskService.setNetworks(this.networks.map(n => ({
      ...n,
      selected: n === network
        ? !network.selected
        : n.selected
    })));
  }
}
