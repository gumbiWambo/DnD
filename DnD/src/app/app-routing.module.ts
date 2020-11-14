import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CharacterComponent } from './character/character/character.component';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { LoginComponent } from './login/login/login.component';


const routes: Routes = [
  {
    path: '',
    component: CharacterComponent,
    canActivate: [AuthenticatedGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
