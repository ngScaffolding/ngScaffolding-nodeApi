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

  public getReferenceValues(req: Request, res: Response, next: NextFunction) {
    const ds: IDataSourceSwitch = DataSourceSwitch.default;

    let name = req.query.name;
    let seed = req.query.seed;
    let group = req.query.group;

    let arrRefValueGetters: Array<Promise<ReferenceValue>> = [];

    ds.dataSource
      .getReferenceValues(name, seed, group)
      .then(arrayRefValues => {
        // Now we have ref values

        if (arrayRefValues) {
          // Loop through RefValues Returned
          arrayRefValues.forEach(refValue => {
            // Call Populate RefValues

            let refObs = ReferenceValuesRouter.populateReferenceValue(refValue, seed, req.headers.authorization);

            arrRefValueGetters.push(refObs);
          });
        }

        if (arrRefValueGetters.length > 0) {
          Promise.all(arrRefValueGetters).then(results => {
            if(results.length === 1){
              res.json(results[0]);
            }else {
              res.json(results);
            }
          });
        } else {
          res.json([]);
        }
      });
  }

  public addReferenceValue(req: Request, res: Response)  {
    const ds: IDataSourceSwitch = DataSourceSwitch.default;

    ds.dataSource
      .saveReferenceValue(req.body as ReferenceValue)
      .then(
        val => {
          res.json(val);
        },
        err => {}
      );
  }

  private static populateReferenceValue  (refValue: ReferenceValue, seed: string, authHeader: string): Promise<ReferenceValue> {
    return new Promise<ReferenceValue>((resolve, reject) => {
      const ds: IDataSourceSwitch = DataSourceSwitch.default;

      // Data Comes from somewhere else
      if (refValue.dataSourceName) {
        // Go Fetch
        ds.dataSource
          .getDataSource(refValue.dataSourceName)
          .then(dataSouorce => {
            switch (dataSouorce.type) {
              
              case DataSourceTypes.RestApi: {
                RESTApiHandler.runCommand(refValue.dataSourceName, {
                  seed: seed
                },null, authHeader).then(dataResults => {
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
                });

                break;
              }
            }
          });
      } else {
        resolve(refValue);
      }
    });
  }

  init() {
    this.router.get('/', this.getReferenceValues);
    this.router.post('/', this.addReferenceValue);
  }
}

const referenceValuesRouter = new ReferenceValuesRouter().router;

export default referenceValuesRouter;
