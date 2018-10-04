import { Component, forwardRef, Inject, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

import { AbstractPageComponent } from '../../../layout/page/page.interface';

import { TextComponent } from '../../../shared/form/text/text.component';
import { PageLayoutComponent } from '../../../layout/page/page.component';

import { KeypairUtils } from '../../../core/keypair/keypair.utils';

@Component({
  selector: 'app-generate',
  templateUrl: './generate.component.html',
  styleUrls: [ './generate.component.scss' ],
})
export class GenerateComponent extends AbstractPageComponent {

  @ViewChild('private', { read: TextComponent }) privateKeyField: TextComponent;
  @ViewChild('public', { read: TextComponent }) publicKeyField: TextComponent;

  privateKey = '';
  publicKey = '';

  constructor(
    @Inject(forwardRef(() => PageLayoutComponent)) pageLayout: PageLayoutComponent,
  ) {
    super(pageLayout, {
      backLink: '/app/keys',
      header: 'routes.keys.generate.title',
      footer: 'routes.keys.generate.generate',
      action: () => this.onGenerate(),
      // disabled: () => !this.password || !this.password.length
    });
  }

  onGenerate(): void {
    if (this.privateKey) {
      KeypairUtils.makePublicKey({
        privateKey: this.privateKey,
        publicKey: ''
      }).then(keypair => {
        this.privateKey = keypair.privateKey;
        this.publicKey = keypair.publicKey;
      });
    } else {
      KeypairUtils.generateKeyPair()
        .then(keypair => {
          this.privateKey = keypair.privateKey;
          this.publicKey = keypair.publicKey;
        });
    }
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
}
