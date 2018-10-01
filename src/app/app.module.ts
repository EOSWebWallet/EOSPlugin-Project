import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { HttpLoaderFactory } from './core/translate/translate-loader.factory';

import { CoreModule } from './core/core.module';
import { RoutesModule } from './routes/routes.module';

import { IAppState } from './core/state/state.interface';

import { AuthEffects } from './core/auth/auth.effects';
import { PluginEffects } from './core/plugin/plugin.effects';

import { AppComponent } from './app.component';

import { reducers, initialState } from './core/state/root.reducer';

import { background, Background } from '../background';
import { content, Content } from '../content';
import { inject, Inject } from '../inject';
import { PromptModule } from './prompt/prompt.module';

// background.seed =
// '2f944c8efe2b6d0dd4019d06ffae60fb67720224cf9fb3df1c942694c700ee1639cf764612380022468b19c9642135ad3de271b6e5fe5b5c1d6e248d26255d21';

export function getInitialState(): Partial<IAppState> {
  return { ...initialState };
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    EffectsModule.forRoot([
      AuthEffects,
      PluginEffects,
    ]),
    RoutesModule,
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
    PromptModule
  ],
  providers: [
    TranslateService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {

  private background: Background;
  private content: Content;
  private inject: Inject;

  constructor(private translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.use('en');

    // this.background = background;
    // this.content = content;
    // this.inject = inject;
  }

}
