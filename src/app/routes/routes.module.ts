import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { RegistrationModule } from './registration/registration.module';
import { LoginModule } from './login/login.module';
import { PromptModule } from '../prompt/prompt.module';

import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { PromptComponent } from '../prompt/prompt.component';

const routes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'app' },
  { path: 'app', loadChildren: '../layout/layout.module#LayoutModule' },
  { path: 'registration', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'prompt', component: PromptComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    RegistrationModule,
    LoginModule,
    PromptModule
  ],
  exports: [
    RouterModule,
  ],
})
export class RoutesModule {}
