import { Application } from "express";
import { Database } from "../database";

export class SpellController {
  private database: Database
  constructor(app: Application) {
    this.database = Database.getInstance();
    app.get('/spells', (req: any, res: any) => {
      this.database.getSpells(this.getQueryParams(req.url).class).then(x => {
        res.send(JSON.stringify(x.sort((a, b) => a.name > b.name? 1 : -1))).sendStatus(200);
      }).catch(() => res.sendStatus(500));
    });
    app.post('/spells', (req: any, res: any) => {
      // res.sendStatus(405);
      this.database.insertSpell(req.body.name, req.body.level, req.body.type, req.body.castingTime, req.body.components, req.body.duration, req.body.discription, req.body.range).catch(() => {
        res.sendStatus(500);
      }).then(() => {
        console.log('woop');
        res.sendStatus(200);
      });
    });
    app.put('/spellClass', (req, res) => {
      res.sendStatus(405);
      // if (req.body.className && req.body.spells) {
      //   this.database.insertSpellClass(req.body.className, req.body.spells).then(() => res.sendStatus(200)).catch(() => res.sendStatus(500));
      // } else {
      //   res.sendStatus(400);
      // }
    });
  }
  private getQueryParams(url: string | undefined): any {
    const rawQueryParams = url?.split('?')[1];
    const queryParams = rawQueryParams?.split('&');
    const returnObject: any = {}
    queryParams?.forEach(x => {
      const [key, value] = x.split('=');
      returnObject[key] = value;
    });
    return returnObject
  }
}