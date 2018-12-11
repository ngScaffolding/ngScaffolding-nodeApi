import { Router, Request, Response, NextFunction } from 'express';
import { IDataSourceSwitch } from '../../dataSourceSwitch';
import {
  DataSourceRequest,
  BaseDataSource,
  RestApiDataSource,
  DataResults,
  ActionResultModel,
  ErrorModel
} from '@ngscaffolding/models';
import { DataSourceHelper } from '../../utils/dataSource.helper';
import { RESTApiHandler } from '../../utils/restApi.dataSource';
import { IDataAccessLayer } from '../../dataSources/dataAccessLayer';

const request = require('request');

var DataSourceSwitch = require('../../dataSourceSwitch');

export class ErrorRouter {
  router: Router;
  constructor() {
    this.router = Router();
    this.init();
  }

  public postError(req: Request, res: Response, next: NextFunction) {
    const ds: IDataSourceSwitch = DataSourceSwitch.default;
    let capRes = res;

    var errorModel = req.body as ErrorModel;
    var dataAccess = DataSourceSwitch.default.dataSource as IDataAccessLayer;

    dataAccess.saveError(errorModel);

    capRes.send('{}');
    next();
  }

  init() {
    this.router.post('/', this.postError);
  }
}

const errorRouter = new ErrorRouter().router;

export default errorRouter;
