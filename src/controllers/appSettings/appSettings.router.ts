import { Router, Request, Response, NextFunction } from 'express';
import { IDataSourceSwitch } from '../../dataSourceSwitch';

import { IDataAccessLayer } from '../../dataSources/dataAccessLayer';

const request = require('request');

var DataSourceSwitch = require('../../dataSourceSwitch');

export class AppSettingsRouter {
  router: Router;
  constructor() {
    this.router = Router();
    this.init();
  }

  public getValues(req: Request, res: Response, next: NextFunction) {
    const ds: IDataSourceSwitch = DataSourceSwitch.default;
    let capRes: any = res;

    var dataAccess = DataSourceSwitch.default.dataSource as IDataAccessLayer;

    dataAccess.getAppSettingsValues().then(defValues => {
      capRes.json(defValues);
    });
  }
  
  init() {
    this.router.get('/', this.getValues);
    }
}

const appSettingsRouter = new AppSettingsRouter().router;

export default appSettingsRouter;
