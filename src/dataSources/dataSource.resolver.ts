import { Router, Request, Response, NextFunction } from 'express';
import { IDataSourceSwitch } from '../dataSourceSwitch';
import { DataSourceRequest, DataSourceTypes } from '../models/index';
import { RESTApiHandler } from '../utils/restApi.dataSource';
import { DataSourceHelper } from '../utils/dataSource.helper';
import { SQLCommandHandler } from '../utils/mssql.dataSource';
import { DocumentDBCommandHandler } from '../utils/documentDB.dataSource';
import { MongoDBCommandHandler } from '../utils/mongoDB.dataSource';

var DataSourceSwitch = require('../dataSourceSwitch');
const winston = require('../config/winston');

export class dataSourceResolver {
  public static resolve(dataRequest: DataSourceRequest, request: Request): Promise<any> {
    return new Promise((resolve, reject) => {
      const ds: IDataSourceSwitch = DataSourceSwitch.default;

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

              RESTApiHandler.runCommand(dataRequest.name, details.inputDetails, details.rows, request.headers.authorization, dataRequest.body)
                .then(
                  dataResults => {
                    dataResults.expiresSeconds = dataSouorce.expires;
                    dataResults.success = true;
                    resolve(dataResults);
                  },
                  err => {
                    reject(err);
                  }
                )
                .catch(err => {
                  reject(err);
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
                    dataResults.success = true;
                    resolve(dataResults);
                  },
                  err => {
                    reject(err);
                  }
                )
                .catch(err => {
                  reject(err);
                });
              break;
            }

            case DataSourceTypes.SQL: {
              let details = DataSourceHelper.prepareInputAndRows(dataRequest.inputData, dataRequest.rowData);

              SQLCommandHandler.runCommand(dataRequest.name, details.inputDetails, details.rows)
                .then(
                  dataResults => {
                    dataResults.expiresSeconds = dataSouorce.expires;
                    dataResults.success = true;
                    resolve(dataResults);
                  },
                  err => {
                    reject(err);
                  }
                )
                .catch(err => {
                  reject(err);
                });
              break;
            }

            case DataSourceTypes.DocumentDB: {
              let details = DataSourceHelper.prepareInputAndRows(dataRequest.inputData, dataRequest.rowData);

              DocumentDBCommandHandler.runCommand(dataRequest.name, details.inputDetails, details.rows)
                .then(
                  dataResults => {
                    dataResults.expiresSeconds = dataSouorce.expires;
                    dataResults.success = true;
                    resolve(dataResults);
                  },
                  err => {
                    reject(err);
                  }
                )
                .catch(err => {
                  reject(err);
                });

              break;
            }
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
