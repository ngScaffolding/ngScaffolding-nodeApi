import { Router, Request, Response, NextFunction } from 'express';
import { IDataSourceSwitch } from '../../dataSourceSwitch';
import {
  DataSourceRequest,
  BaseDataSource,
  RestApiDataSource,
  DataResults,
  ActionResultModel,
  UserPreferenceDefinition
} from '@ngscaffolding/models';
import { DataSourceHelper } from '../../utils/dataSource.helper';
import { RESTApiHandler } from '../../utils/restApi.dataSource';
import { IDataAccessLayer } from '../../dataSources/dataAccessLayer';

const request = require('request');

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

    dataAccess.getAllWidgets().subscribe(widgets => {
      capRes.json(widgets);
    });
  }

  init() {
    this.router.get('/', this.getWidgets);
  }
}

const widgetsRouter = new WidgetsRouter().router;

export default widgetsRouter;
