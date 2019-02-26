import { Router, Request, Response, NextFunction } from 'express';
import { ReferenceValue, BaseDataSource, ReferenceValueItem, RestApiDataSource, DataSourceTypes } from '@ngscaffolding/models';
import { IDataSourceSwitch } from '../../dataSourceSwitch';
import { RESTApiHandler } from '../../utils/restApi.dataSource';

var DataSourceSwitch = require('../../dataSourceSwitch');

export class ReferenceValuesRouter {
  router: Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  public getReferenceValue(req: Request, res: Response, next: NextFunction) {
    const ds: IDataSourceSwitch = DataSourceSwitch.default;

    let name = req.query.name;
    let seed = req.query.seed;

    let arrRefValueGetters: Array<Promise<ReferenceValue>> = [];

    ds.dataSource.getReferenceValue(name).then(
      refValue => {
        ReferenceValuesRouter.populateReferenceValue(refValue, seed, req.headers.authorization).then(refValue => {
          res.json(refValue);
        }, error => { 
          res.sendStatus(500);
        });
      },
      error => {
        res.sendStatus(500);
      }
    );
  }

  public addReferenceValue(req: Request, res: Response) {
    const ds: IDataSourceSwitch = DataSourceSwitch.default;

    ds.dataSource.saveReferenceValue(req.body as ReferenceValue).then(
      val => {
        res.json(val);
      },
      err => {}
    );
  }

  private static populateReferenceValue(refValue: ReferenceValue, seed: string, authHeader: string): Promise<ReferenceValue> {
    return new Promise<ReferenceValue>((resolve, reject) => {
      const ds: IDataSourceSwitch = DataSourceSwitch.default;

      // Data Comes from somewhere else
      if (refValue.dataSourceName) {
        // Go Fetch
        ds.dataSource.getDataSource(refValue.dataSourceName).then(
          dataSouorce => {
            switch (dataSouorce.type) {
              case DataSourceTypes.RestApi: {
                RESTApiHandler.runCommand(refValue.dataSourceName, { seed: seed }, null, authHeader).then(dataResults => {
                  if (!dataResults) {
                    reject();
                  } else {
                    let returnedItems: any[] = JSON.parse(dataResults.jsonData);
                    refValue.referenceValueItems = [];
                    let idCount = 0;
                    returnedItems.forEach(item => {
                      refValue.referenceValueItems.push({
                        value: item[refValue.valueProperty],
                        display: item[refValue.displayProperty],
                        itemOrder: item[refValue.itemOrderProperty],
                        subtitle: item[refValue.subtitleProperty]
                      });
                    });
                    resolve(refValue);
                  }
                });
                break;
              }
            }
          },
          error => {
            reject(error);
          }
        );
      } else {
        resolve(refValue);
      }
    });
  }

  init() {
    this.router.get('/', this.getReferenceValue);
    this.router.post('/', this.addReferenceValue);
  }
}

const referenceValuesRouter = new ReferenceValuesRouter().router;

export default referenceValuesRouter;
