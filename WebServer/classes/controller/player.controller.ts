import { Application } from "express";
import { Database } from "../database";

export class PlayerController {
  private database: Database;
  constructor(app: Application) {
    this.database = Database.getInstance();
    app.get('/player', (req, res) => {
      const queryParams = this.getQueryParams(req.url);
      if(!!queryParams && !!queryParams.name) {
        this.database.getPlayer(queryParams.name).then(x => {
          res.send({master: x.master}).sendStatus(200);
        });
      } else {
        res.sendStatus(400);
      }
    });
    app.post('/player', (req, res) => {
      res.sendStatus(405);
      // this.database.insertPlayer(req.body.name).catch(() => {
      //   res.sendStatus(500);
      // }).then(() => {
      //   res.sendStatus(200);
      // });
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