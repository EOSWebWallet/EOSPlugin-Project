import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

const routes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'app' },
  { path: 'app', loadChildren: '../layout/layout.module#LayoutModule' },
  { path: 'registration', loadChildren: './registration/registration.module#RegistrationModule' },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class RoutesModule {}
