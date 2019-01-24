import { Router, Request, Response, NextFunction } from 'express';
import { IDataSourceSwitch } from '../../dataSourceSwitch';
import { DataSourceRequest, BaseDataSource, RestApiDataSource, DataResults, SqlDataSource } from '@ngscaffolding/models';
import { RESTApiHandler } from '../../utils/restApi.dataSource';
import { DataSourceHelper } from '../../utils/dataSource.helper';
import { KumulosDataService } from '../../utils/kumulos.dataSource';
import { SQLCommandHandler } from '../../utils/mssql.dataSource';
import { DocumentDBCommandHandler } from '../../utils/documentDB.dataSource';

var DataSourceSwitch = require('../../dataSourceSwitch');

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
      ds.dataSource.getDataSource(dataRequest.name).subscribe(dataSouorce => {
        switch (dataSouorce.type) {
          case BaseDataSource.TypesRestApi: {
            let details = DataSourceHelper.prepareInputAndRows(dataRequest.inputData, dataRequest.rowData);

            RESTApiHandler.runCommand(dataRequest.name, details.inputDetails, details.rows).subscribe(
              dataResults => {
                dataResults.expiresSeconds = dataSouorce.expires;
                capRes.json(dataResults);
              },
              err => {
                capRes.status(500).send('Call failed');
              }
            );
            break;
          }

          case BaseDataSource.TypesMySQL: {
            break;
          }

          case BaseDataSource.TypesMongoDB: {
            break;
          }

          case BaseDataSource.TypesSQL: {
            var sqlDataSource = dataSouorce.dataSourceDetails as SqlDataSource;

            let details = DataSourceHelper.prepareInputAndRows(dataRequest.inputData, dataRequest.rowData);
            SQLCommandHandler.runCommand(dataRequest.name, details.inputDetails, details.rows).subscribe(
              dataResults => {
                dataResults.expiresSeconds = dataSouorce.expires;
                capRes.json(dataResults);
              },
              err => {
                capRes.status(500).send('Call failed');
              }
            );
            break;
          }

          case BaseDataSource.TypesDocumentDB: {
            let details = DataSourceHelper.prepareInputAndRows(dataRequest.inputData, dataRequest.rowData);

            DocumentDBCommandHandler.runCommand(dataRequest.name, details.inputDetails, details.rows).subscribe(
              dataResults => {
                dataResults.expiresSeconds = dataSouorce.expires;
                capRes.json(dataResults);
              },
              err => {
                capRes.status(500).send('Call failed');
              }
            );

            break;
          }

          case BaseDataSource.TypesKumulos: {
            var kumulosDataSource = dataSouorce.dataSourceDetails as RestApiDataSource;
            KumulosDataService.callFunction(kumulosDataSource.url, null, null).subscribe(
              dataResults => {
                let returnResults: DataResults = {
                  expiresSeconds: 0,
                  rowCount: 0,
                  jsonData: JSON.stringify(dataResults),
                  results: [{ success: true, message: '' }]
                };

                capRes.json(returnResults);
              },
              err => {
                capRes.status(500).send('Call failed');
              }
            );

            break;
          }
        }
      });
    }
  }

  init() {
    this.router.post('/', this.postDataSource);
  }
}

const dataSourceRouter = new DataSourceRouter().router;

export default dataSourceRouter;
