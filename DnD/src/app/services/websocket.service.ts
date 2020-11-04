import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  constructor() { }
  
  public connect(url): BehaviorSubject<any> {
    let subject: BehaviorSubject<any>;
    subject = this.create(url);
    console.log("Successfully connected: " + url);
    return subject;
  }
  private create(url): BehaviorSubject<any> {
    let ws = new WebSocket(url);
    let observable = Observable.create((obs: Observer<any>) => {
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);
      return ws.close.bind(ws);
    });
    let observer = {
      next: (data: Object) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      }
    };
    return BehaviorSubject.create(observer, observable);
  }
}
