import * as WebSocket from 'ws';
import { Equipment } from '../equipment/equipment';
import { CharacterConnection } from "./character-connection";

let characterManager: CharacterManager
export class CharacterManager {
  private masterConnection: WebSocket | null = null;
  public connections: CharacterConnection[] = [];
  constructor() {}

  public static getInstance(): CharacterManager {
    if(!characterManager) {
      characterManager = new CharacterManager();
    }
    return characterManager;
  }
  public setMasterConnection(ws: WebSocket) {
    console.log('Master Connected');
    this.masterConnection = ws;
    this.masterConnection.on('close', () => this.removeMasterConnection());
    this.masterConnection.on('error', (error) => console.log(error));
    this.masterConnection.on('message', (data: string) => {
      const commandFromSocket = JSON.parse(data);
      switch(commandFromSocket.command) {
        case 'chooseCharacter': break;
        case 'addEquipment': this.addEquipment(commandFromSocket.playerName, commandFromSocket.equipment); break;
        case 'decreaseEquipment': this.decreaseEquipment(commandFromSocket.playerName, commandFromSocket.equipment); break;
        case 'setCurrency': this.setCurrency(commandFromSocket.playerName, commandFromSocket.currency, commandFromSocket.amount); break;
      }
    });
    this.sendMasterConnection({type: 'playerList', data: this.connections.map(x => x.playerName)});
  }
  public addPlayerConnection(playerName: string, ws: WebSocket) {
    ws.on('close', () => {
      this.removePlayerConnection(playerName);
    });
    this.connections.push(new CharacterConnection(playerName, ws));
    this.sendMasterConnection({type: 'playerList', data: this.connections.map(x => x.playerName)});
  }
  public removePlayerConnection(playerName: string) {
    this.connections.splice(characterManager.connections.findIndex(x => x.playerName === playerName), 1);
    this.sendMasterConnection({type: 'playerList', data: this.connections.map(x => x.playerName)});
  }
  private removeMasterConnection() {
    if(this.masterConnection) {
      this.masterConnection.close();
    }
    this.masterConnection = null
  }
  private addEquipment(playerName: string, equipment: Equipment) {
    const connection = this.getConnection(playerName);
    connection?.addEquipment(equipment);
  }
  private decreaseEquipment(playerName: string, equipment: Equipment) {
    const connection = this.getConnection(playerName);
    connection?.decreaseEquipment(equipment);
  }
  private setCurrency(playerName: string, currency: string, amount: number) {
    const connection = this.getConnection(playerName);
    connection?.updateCurrency(currency, amount);
  }
  private getConnection(playerName: string): CharacterConnection | undefined {
    return this.connections.find(x => x.playerName === playerName);
  }
  private sendMasterConnection<T>(content: T) {
    if(!!this.masterConnection) {
      this.masterConnection.send(JSON.stringify(content));
    }
  }
}