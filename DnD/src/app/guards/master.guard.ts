import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PlayerService } from '../services/player.service';

@Injectable({
  providedIn: 'root'
})
export class MasterGuard implements CanActivate {
  constructor(private router: Router, private player: PlayerService){
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const storageMaster = localStorage.getItem('master');
    const isMaster = storageMaster === 'true';
    if(!isMaster && !!this.player.playerName) {
      return this.router.parseUrl('');
    } else if(!isMaster) {
      return this.router.parseUrl('login');
    }
    return true;
  }
  
}
