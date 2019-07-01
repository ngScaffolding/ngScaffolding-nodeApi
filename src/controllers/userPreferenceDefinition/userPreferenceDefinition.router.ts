import { Router, Request, Response, NextFunction } from 'express';
import { IDataSourceSwitch } from '../../dataSourceSwitch';
import { IDataAccessLayer } from '../../dataSources/dataAccessLayer';

var DataSourceSwitch = require('../../dataSourceSwitch');

export class UserPreferenceDefinitionRouter {
  router: Router;
  constructor() {
    this.router = Router();
    this.init();
  }

  public getDefinitions(req: Request, res: Response, next: NextFunction) {
    const ds: IDataSourceSwitch = DataSourceSwitch.default;
    let capRes = res;

    var dataAccess = DataSourceSwitch.default.dataSource as IDataAccessLayer;

    dataAccess.getUserPreferenceDefinitions().then(defValues => {
      capRes.json(defValues);
    });
  }

  init() {
    this.router.get('/', this.getDefinitions);
  }
}

const userPreferenceDefinitionRouter = new UserPreferenceDefinitionRouter().router;

export default userPreferenceDefinitionRouter;
