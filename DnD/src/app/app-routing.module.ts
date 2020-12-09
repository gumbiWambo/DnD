import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CharacterComponent } from './character/character/character.component';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { LoginComponent } from './login/login/login.component';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./character/character.module').then(m => m.CharacterModule),
    canActivate: [AuthenticatedGuard]
  },
  {
    path: 'master',
    loadChildren: () => import('./master/master.module').then(m => m.MasterModule)

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
