import { Application } from "express";
import { Database } from "../database";

export class EquipmentController {
  private database: Database;
  constructor(app: Application) {
    this.database = Database.getInstance();
    app.get('/equipments', (req, res) => {
      this.database.getEquipments().then(x => {
        res.send(JSON.stringify(x)).sendStatus(200);
      }).catch(() => res.sendStatus(500));
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