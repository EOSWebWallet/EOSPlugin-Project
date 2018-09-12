import { NgModule } from '@angular/core';

import { AuthService } from './auth/auth.service';

@NgModule({
  providers: [
    AuthService,
  ],
})
export class CoreModule { }
