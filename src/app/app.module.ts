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

  constructor(private translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.use('en');

    this.background = background;
  }

}
