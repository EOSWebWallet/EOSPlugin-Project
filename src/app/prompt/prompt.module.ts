import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { HttpLoaderFactory } from '../core/translate/translate-loader.factory';

import { CoreModule } from '../core/core.module';
import { IdentityModule } from './identity/identity.module';

import { PromptService } from './prompt.service';

import { PromptComponent } from './prompt.component';


@NgModule({
  declarations: [
    PromptComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    NoopAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [ HttpClient ]
      }
    }),
    IdentityModule
  ],
  providers: [
    TranslateService,
    PromptService
  ],
  bootstrap: [
    PromptComponent
  ]
})
export class PromptModule {

  constructor(private translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

}
