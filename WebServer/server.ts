import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import * as bodyParser from 'body-parser';
import { Database } from './classes/database';
import { CharacterConnection } from './classes/character/character-connection';
import { DrawConnectionMagager } from './classes/draw/draw-connection-manager';
import { DrawConnection } from './classes/draw/draw-connection';
import { MapManager } from './classes/map/map-manager';
import { MapConnection } from './classes/map/map-connection';
import { CharacterManager } from './classes/character/character-manager';

const app = express();
const server = http.createServer(app);
const tradeServer = http.createServer();
const wssCharacter = new WebSocket.Server({server});
const wssTrade = new WebSocket.Server({server: tradeServer});
const database = Database.getInstance();
const drawManager = DrawConnectionMagager.getInstance();
const mapManager = MapManager.getInstance();
const characterManager = CharacterManager.getInstance();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});
app.use(bodyParser.json());
wssCharacter.on('connection', (ws: WebSocket, request) => {
  const queryParams = getQueryParams(request.url);
  const playerName = queryParams.player;
  if(!isValid(playerName)) {
    if(queryParams.color) {
      drawManager.addConnection(new DrawConnection(playerName, queryParams.color, ws));
    } else if(queryParams.map && playerName) {
      mapManager.addConnection(new MapConnection(playerName, ws, queryParams.master))
    } else {
      ws.close();
    }
  }
  if(playerName) {
    createPlayerConnection(playerName, ws);
  }

});
wssTrade.on('connection', (ws: WebSocket) => {
  ws.on('message', (data) => {console.log(data)});
});

app.get('/player', (req, res) => {
  res.sendStatus(501);
});
app.post('/player', (req, res) => {
  res.sendStatus(405);
  // database.insertPlayer(req.body.name).catch(() => {
  //   res.sendStatus(500);
  // }).then(() => {
  //   res.sendStatus(200);
  // });
});
app.get('/spells', (req, res) => {
  database.getSpells(getQueryParams(req.url).class).then(x => {
    res.send(JSON.stringify(x.sort((a, b) => a.name > b.name? 1 : -1))).sendStatus(200);
  }).catch(() => res.sendStatus(500));
});
app.post('/spells', (req, res) => {
  res.sendStatus(405);
  // database.insertSpell(req.body.name, req.body.level, req.body.type, req.body.castingTime, req.body.components, req.body.duration, req.body.discription, req.body.range).catch(() => {
  //   res.sendStatus(500);
  // }).then(() => {
  //   console.log('woop');
  //   res.sendStatus(200);
  // });
});
app.get('/map/:name', (req, res) => {
  try{
    res.sendFile(__dirname + '/maps/' + req.params.name + '.html');
  } catch(error) {
    res.sendStatus(500);
  }
});
app.put('/spellClass', (req, res) => {
  res.sendStatus(405);
  // if (req.body.className && req.body.spells) {
  //   database.insertSpellClass(req.body.className, req.body.spells).then(() => res.sendStatus(200)).catch(() => res.sendStatus(500));
  // } else {
  //   res.sendStatus(400);
  // }
});
server.listen(1337, '0.0.0.0', () => {
  console.log(`Server started on port ${JSON.stringify(server.address())}`);
});
tradeServer.listen(8080, '0.0.0.0', () => {
  console.log(`Trade Server started on port ${JSON.stringify(tradeServer.address())}`);
});


/*
 Helper Functions
*/
function isValid(playerName: string): boolean {
  const existingConnection = characterManager.connections.find(x => x.playerName === playerName);
  return !existingConnection;
}
function createPlayerConnection(playerName: string, ws: WebSocket) {
  ws.on('close', () => {
    characterManager.connections.splice(characterManager.connections.findIndex(x => x.playerName === playerName), 1);
  });
  characterManager.connections.push(new CharacterConnection(playerName, ws));
}
function getQueryParams(url: string | undefined): any {
  const rawQueryParams = url?.split('?')[1];
  const queryParams = rawQueryParams?.split('&');
  const returnObject: any = {}
  queryParams?.forEach(x => {
    const [key, value] = x.split('=');
    returnObject[key] = value;
  });
  return returnObject
}