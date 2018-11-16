import { Component, forwardRef, Inject, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs/internal/Subject';
import { Subscription } from 'rxjs/internal/Subscription';
import { first, debounceTime, flatMap } from 'rxjs/internal/operators';

import { UIService } from '../../../core/ui/ui.service';

import { AbstractPageComponent } from '../../../layout/page/page.interface';
import { TextComponent } from '../../../shared/form/text/text.component';
import { PageLayoutComponent } from '../../../layout/page/page.component';

import { Keypairs } from '../../../core/keypair/keypair';

@Component({
  selector: 'app-generate',
  templateUrl: './generate.component.html',
  styleUrls: [ './generate.component.scss' ],
})
export class GenerateComponent extends AbstractPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('form') form: FormGroup;

  @ViewChild('private', { read: TextComponent }) privateKeyField: TextComponent;
  @ViewChild('public', { read: TextComponent }) publicKeyField: TextComponent;

  privateKey = '';
  publicKey = '';

  private privateKeyChanged$ = new Subject<void>();
  private privateKeySub: Subscription;
  private formSub: Subscription;

  constructor(
    @Inject(forwardRef(() => PageLayoutComponent)) pageLayout: PageLayoutComponent,
    private uiService: UIService
  ) {
    super(pageLayout, {
      backLink: '/app/keys',
      header: 'routes.keys.generate.title',
      footer: 'routes.keys.generate.generate',
      action: () => this.onGenerate(),
      // disabled: () => !this.password || !this.password.length
    });
  }

  ngAfterViewInit(): void {
    this.restoreUIState();
  }

  ngOnDestroy(): void {
    this.destroyUIState();

    if (this.privateKeySub) {
      this.privateKeySub.unsubscribe();
    }
    if (this.formSub) {
      this.formSub.unsubscribe();
    }
  }

  onGenerate(): void {
    Keypairs.generateKeyPair()
      .then(keypair => {
        this.privateKey = keypair.privateKey;
        this.publicKey = keypair.publicKey;
      });
  }

  onPrivateKeyEnter(): void {
    this.privateKeyChanged$.next();
  }

  onCopyPrivateKey(event: Event): void {
    event.preventDefault();
    this.copyToClipboard(this.privateKeyField);
  }

  onCopyPublicKey(event: Event): void {
    event.preventDefault();
    this.copyToClipboard(this.publicKeyField);
  }

  private copyToClipboard(field: TextComponent): void {
    const inputEl = field.inputField.nativeElement;
    inputEl.select();
    document.execCommand('copy');
  }

  private initUIStateHandler(): void {
    this.formSub = this.form.valueChanges
      .subscribe(value => {
        this.uiService.setState('generateForm', value);
      });
  }

  private initPrivateKeyHandler(): void {
    this.privateKeySub = this.privateKeyChanged$
      .pipe(
        debounceTime(500),
        flatMap(() => Keypairs.makePublicKey({
          privateKey: this.privateKey,
          publicKey: ''
        }))
      )
      .subscribe(keypair => {
        this.privateKey = keypair.privateKey;
        this.publicKey = keypair.publicKey;
      });
  }

  private restoreUIState(): void {
    setTimeout(() => {
      this.uiService.getState('generateForm')
        .pipe(
          first()
        )
        .subscribe(value => {
          if (value) {
            this.form.setValue(value);
          }
          this.initUIStateHandler();
          this.initPrivateKeyHandler();
        });
    });
  }

  private destroyUIState(): void {
    this.uiService.setState('generateForm', null);
  }
}
