import { Router, Request, Response, NextFunction } from 'express';
import { IDataSourceSwitch } from '../../dataSourceSwitch';
import { UserPreferenceDefinition } from '../../models/src/index';
import { IDataAccessLayer } from '../../dataSources/dataAccessLayer';

var DataSourceSwitch = require('../../dataSourceSwitch');

export class WidgetsRouter {
  router: Router;
  constructor() {
    this.router = Router();
    this.init();
  }

  public getWidgets(req: Request, res: Response, next: NextFunction) {
    const ds: IDataSourceSwitch = DataSourceSwitch.default;
    let capRes = res;

    var userPreferenceDefinition = req.body as UserPreferenceDefinition;
    var dataAccess = DataSourceSwitch.default.dataSource as IDataAccessLayer;

    dataAccess.getAllWidgets().then(widgets => {
      capRes.json(widgets);
    });
  }

  init() {
    this.router.get('/', this.getWidgets);
  }
}

const widgetsRouter = new WidgetsRouter().router;

export default widgetsRouter;
