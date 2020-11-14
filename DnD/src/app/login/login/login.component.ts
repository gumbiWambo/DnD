import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { PlayerService } from 'src/app/services/player.service';

@Component({
  selector: 'dnd-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private player: PlayerService, private router: Router) { }

  ngOnInit(): void {
  }

  public login(form: NgForm) {
    if(form.value.playerName) {
      this.player.connect(form.value.playerName, form.value.playerColor);
      this.router.navigate(['']);
    }
  }

}
