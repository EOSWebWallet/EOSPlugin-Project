import { Component, forwardRef, Inject, OnInit, ViewChild, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import { Subject } from 'rxjs/internal/Subject';
import { first, map, filter, distinctUntilChanged } from 'rxjs/operators';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';

import { IAccount } from '../../../core/account/account.interface';
import { INetwork } from '../../../core/network/network.interface';
import { IPageConfig, AbstractPageComponent } from '../../../layout/page/page.interface';

import { NetworksService } from '../../../core/network/networks.service';
import { AccountService } from '../../../core/account/account.service';
import { UIService } from '../../../core/ui/ui.service';

import { PageLayoutComponent } from '../../../layout/page/page.component';

import { Networks } from '../../../core/network/network';

@Component({
  selector: 'app-networks',
  templateUrl: './networks.component.html',
  styleUrls: [ './networks.component.scss' ],
})
export class NetworksComponent extends AbstractPageComponent implements OnInit, AfterViewInit, OnDestroy {

  private form: FormGroup;
  private createFormEl: ElementRef;

  @ViewChild('form') set networkForm(form: FormGroup) {
    this.form = form;

    if (form) {
      if (this.formSub) {
        this.formSub.unsubscribe();
      }
      this.formSub = form.valueChanges
        .subscribe(() => this.stateChanged$.next());
    }
  }

  @ViewChild('createForm', { read: ElementRef }) set createForm(el: ElementRef) {
    this.createFormEl = el;
    if (this.createFormEl) {
      this.createFormEl.nativeElement.scrollIntoView();
    }
  }

  networks: INetwork[] = [];

  newNetwork: INetwork;
  editableNetwork: INetwork;

  accounts: IAccount[] = [];

  private stateChanged$ = new Subject<void>();

  private formSub: Subscription;
  private stateSub: Subscription;
  private networksSub: Subscription;

  constructor(
    @Inject(forwardRef(() => PageLayoutComponent)) pageLayout: PageLayoutComponent,
    private networskService: NetworksService,
    private accountService: AccountService,
    private uiService: UIService
  ) {
    super(pageLayout, {
      backLink: '/app/settings',
      header: 'routes.settings.networks.title',
      footer: 'routes.settings.networks.add',
      action: () => this.onAdd()
    });
  }

  ngOnInit(): void {
    this.accountService.accounts$
      .pipe(
        filter(Boolean),
        first()
      )
      .subscribe(accounts => this.accounts = accounts);

    this.networksSub = this.networks$
      .pipe(
        // TODO: for prevent dead lock while updating networks and monitoring ui state, need refactor
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
      )
      .subscribe(networks => this.networks = networks);
  }

  ngAfterViewInit(): void {
    this.restoreUIState();
  }

  ngOnDestroy(): void {
    this.destroyUIState();
    if (this.formSub) {
      this.formSub.unsubscribe();
    }
    if (this.stateSub) {
      this.stateSub.unsubscribe();
    }
    this.networksSub.unsubscribe();
  }

  get networks$(): Observable<INetwork[]> {
    return this.networskService.networks$;
  }

  onAdd(): void {
    this.newNetwork = Networks.createNetwork();
    this.editableNetwork = null;
    this.stateChanged$.next();
  }

  onUpdate(): void {
    this.networskService.update(this.editableNetwork.id, this.editableNetwork);
    this.editableNetwork = null;
  }

  onDelete(network: INetwork): void {
    this.networskService.delete(network.id);
  }

  onSelect(network: INetwork): void {
    this.networskService.select(network.id);
  }

  onEdit(network: INetwork): void {
    if (!this.hasAccounts(network)) {
      this.editableNetwork = !this.editableNetwork || this.editableNetwork.id !== network.id
        ? { ...network }
        : null;
      this.newNetwork = null;
      this.stateChanged$.next();
    }
  }

  onCreate(): void {
    this.networskService.save(this.newNetwork);
    this.newNetwork = null;
  }

  onCancel(event: any): void {
    event.preventDefault();
    this.newNetwork = null;
    this.editableNetwork = null;
  }

  hasAccounts(network: INetwork): boolean {
    return !!this.accounts.find(a => a.network.id === network.id);
  }

  isEditing(network: INetwork): boolean {
    return network && this.editableNetwork && network.id === this.editableNetwork.id;
  }

  private initUIStateHandler(): void {
    this.stateSub = this.stateChanged$
      .subscribe(value => {
        this.uiService.setState('networks', {
          ...(
            this.form
              ? { form: this.form.value }
              : {}
          ),
          newNetwork: this.newNetwork,
          editableNetwork: this.editableNetwork
        });
      });
  }

  private restoreUIState(): void {
    this.uiService.getState('networks')
      .pipe(
        first()
      )
      .subscribe(networks => {
        const { form, newNetwork, editableNetwork } = networks || {} as any;
        if (form) {
          setTimeout(() => this.form.setValue(form));
        }
        this.newNetwork = newNetwork || this.newNetwork;
        this.editableNetwork = editableNetwork || this.editableNetwork;
        this.initUIStateHandler();
      });
  }

  private destroyUIState(): void {
    this.uiService.setState('networks', null);
  }
}
