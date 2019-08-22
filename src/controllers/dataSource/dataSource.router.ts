import { Router, Request, Response, NextFunction } from 'express';
import { IDataSourceSwitch } from '../../dataSourceSwitch';
import { DataSourceRequest, DataSourceTypes } from '../../models/index';
import { RESTApiHandler } from '../../utils/restApi.dataSource';
import { DataSourceHelper } from '../../utils/dataSource.helper';
import { SQLCommandHandler } from '../../utils/mssql.dataSource';
import { DocumentDBCommandHandler } from '../../utils/documentDB.dataSource';
import { MongoDBCommandHandler } from '../../utils/mongoDB.dataSource';

var DataSourceSwitch = require('../../dataSourceSwitch');
const winston = require('../../config/winston');

export class DataSourceRouter {
  router: Router;
  constructor() {
    this.router = Router();
    this.init();
  }

  public postDataSource(req: Request, res: Response, next: NextFunction) {
    const ds: IDataSourceSwitch = DataSourceSwitch.default;

    let dataRequest = req.body as DataSourceRequest;

    let capRes = res;

    if (dataRequest) {
      // If we have a seed value add it into the inputData
      if (dataRequest.seed) {
        if (dataRequest.inputData) {
          dataRequest.inputData['seed'] = dataRequest.seed;
        } else {
          dataRequest.inputData = { seed: dataRequest.seed };
        }
      }
      ds.dataSource
        .getDataSource(dataRequest.name)
        .then(dataSouorce => {
          switch (dataSouorce.type) {
            case DataSourceTypes.RestApi: {
              let details = DataSourceHelper.prepareInputAndRows(dataRequest.inputData, dataRequest.rowData);

              RESTApiHandler.runCommand(dataRequest.name, details.inputDetails, details.rows, req.headers.authorization, dataRequest.body)
                .then(
                  dataResults => {
                    dataResults.expiresSeconds = dataSouorce.expires;
                    capRes.json(dataResults);
                  },
                  err => {
                    winston.error(err);
                    capRes.status(500).send('Call failed');
                  }
                )
                .catch(err => {
                  winston.error(err);
                  capRes.status(500).send('Call failed');
                });
              break;
            }

            case DataSourceTypes.MySQL: {
              break;
            }

            case DataSourceTypes.MongoDB: {
              let details = DataSourceHelper.prepareInputAndRows(dataRequest.inputData, dataRequest.rowData);

              MongoDBCommandHandler.runCommand(dataRequest.name, details.inputDetails, details.rows)
                .then(
                  dataResults => {
                    dataResults.expiresSeconds = dataSouorce.expires;
                    capRes.json(dataResults);
                  },
                  err => {
                    winston.error(err);
                    capRes.status(500).send('Call failed');
                  }
                )
                .catch(err => {
                  winston.error(err);
                  capRes.status(500).send('Call failed');
                });
              break;
            }

            case DataSourceTypes.SQL: {
              let details = DataSourceHelper.prepareInputAndRows(dataRequest.inputData, dataRequest.rowData);

              SQLCommandHandler.runCommand(dataRequest.name, details.inputDetails, details.rows)
                .then(
                  dataResults => {
                    dataResults.expiresSeconds = dataSouorce.expires;
                    capRes.json(dataResults);
                  },
                  err => {
                    capRes.status(500).send('Call failed');
                  }
                )
                .catch(err => {
                  winston.error(err);
                  capRes.status(500).send('Call failed');
                });
              break;
            }

            case DataSourceTypes.DocumentDB: {
              let details = DataSourceHelper.prepareInputAndRows(dataRequest.inputData, dataRequest.rowData);

              DocumentDBCommandHandler.runCommand(dataRequest.name, details.inputDetails, details.rows)
                .then(
                  dataResults => {
                    dataResults.expiresSeconds = dataSouorce.expires;
                    capRes.json(dataResults);
                  },
                  err => {
                    capRes.status(500).send('Call failed');
                  }
                )
                .catch(err => {
                  winston.error(err);
                  capRes.status(500).send('Call failed');
                });

              break;
            }
          }
        })
        .catch(err => {
          winston.error(err);
          capRes.status(500).send('Call failed');
        });
    }
  }

  init() {
    this.router.post('/', this.postDataSource);
  }
}

const dataSourceRouter = new DataSourceRouter().router;

export default dataSourceRouter;
