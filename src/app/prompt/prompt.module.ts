import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { AuthEffects } from '../core/auth/auth.effects';
import { PluginEffects } from '../core/plugin/plugin.effects';

import { HttpLoaderFactory } from '../core/translate/translate-loader.factory';

import { CoreModule } from '../core/core.module';
import { IdentityModule } from './identity/identity.module';

import { IAppState } from '../core/state/state.interface';

import { AuthService } from '../core/auth/auth.service';
import { PromptService } from './prompt.service';

import { PromptComponent } from './prompt.component';

import { reducers, initialState } from '../core/state/root.reducer';

export function getInitialState(): Partial<IAppState> {
  return { ...initialState };
}

const routes: Routes = [
  {
    path: '',
    component: PromptComponent
  },
];

@NgModule({
  declarations: [
    PromptComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    RouterModule.forChild(routes),
    EffectsModule.forRoot([
      AuthEffects,
      PluginEffects,
    ]),
    NoopAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [ HttpClient ]
      }
    }),
    StoreModule.forRoot(reducers, { initialState: getInitialState }),
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

  constructor(
    private translate: TranslateService,
    private authService: AuthService,
  ) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

}
