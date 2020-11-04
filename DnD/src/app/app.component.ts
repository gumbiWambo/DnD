import { Component } from '@angular/core';
import { WebsocketService } from './services/websocket.service';
import { environment } from 'src/environments/environment';
import { PlayerService } from './services/player.service';

@Component({
  selector: 'dnd-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'DnD';
  socket;
  constructor(private webSocket: WebsocketService, private playerService: PlayerService) {

  }


}
