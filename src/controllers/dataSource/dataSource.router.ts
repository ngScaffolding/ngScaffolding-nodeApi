import { Router, Request, Response, NextFunction } from 'express';
import { IDataSourceSwitch } from '../../dataSourceSwitch';
import { DataSourceRequest, DataSourceTypes } from '../../models/index';
import { RESTApiHandler } from '../../utils/restApi.dataSource';
import { DataSourceHelper } from '../../utils/dataSource.helper';
import { SQLCommandHandler } from '../../utils/mssql.dataSource';
import { DocumentDBCommandHandler } from '../../utils/documentDB.dataSource';
import { MongoDBCommandHandler } from '../../utils/mongoDB.dataSource';
import { dataSourceResolver } from '../../dataSources/dataSource.resolver';

var DataSourceSwitch = require('../../dataSourceSwitch');
const winston = require('../../config/winston');

export class DataSourceRouter {
  router: Router;
  constructor() {
    this.router = Router();
    this.init();
  }

  public postDataSource(req: Request, res: Response, next: NextFunction) {

    let dataRequest = req.body as DataSourceRequest;

    let capRes = res;

    dataSourceResolver
      .resolve(dataRequest, req)
      .then(dataResults => {
        capRes.json(dataResults);
      })
      .catch(err => {
        winston.error(err);
        capRes.status(500).send('Call failed');
      });
  }

  init() {
    this.router.post('/', this.postDataSource);
  }
}

const dataSourceRouter = new DataSourceRouter().router;

export default dataSourceRouter;
