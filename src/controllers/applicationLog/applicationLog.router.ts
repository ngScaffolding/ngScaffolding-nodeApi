import { Router, Request, Response, NextFunction } from "express";
import { IDataAccessLayer } from "../../dataSources/dataAccessLayer";
var DataSourceSwitch = require('../../dataSourceSwitch');

export class ApplicationLogRouter {
  router: Router;
  private dataAccess: IDataAccessLayer;

  constructor() {
    this.router = Router();
    this.init();
  }

  public async saveApplicationLog(req: Request, res: Response, next: NextFunction) {

    let ds = DataSourceSwitch.default.dataSource as IDataAccessLayer;

    ds.saveApplicationLog(req.body)
      .subscribe(res => {

      });
    
  }

  public postNew(req: Request, res: Response, next: NextFunction) {
    let ds = new DataSourceSwitch();
    ds.dataAccess.saveApplicationLog();
  }

  init() {
    // this.router.get("/", this.getAll);
    this.router.post("/", this.saveApplicationLog);
  }
}

// Create the HeroRouter, and export its configured Express.Router
const applicationLogRouter = new ApplicationLogRouter().router

export default applicationLogRouter;
