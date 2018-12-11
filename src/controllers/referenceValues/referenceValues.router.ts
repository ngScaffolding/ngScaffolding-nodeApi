import { Router, Request, Response, NextFunction } from 'express';
import { MongoDBDataAccess } from '../../dataSources/mongodb/mongoDBDataAccess';
import { Observable ,  forkJoin } from 'rxjs';
import { ReferenceValue, BaseDataSource, ReferenceValueItem, RestApiDataSource } from '@ngscaffolding/models';
import { IDataSourceSwitch } from '../../dataSourceSwitch';
import { RESTApiHandler } from '../../utils/restApi.dataSource';
import { KumulosDataService } from '../../utils/kumulos.dataSource';

var DataSourceSwitch = require('../../dataSourceSwitch');

export class ReferenceValuesRouter {
  router: Router;
  private dataAccess: MongoDBDataAccess;

  constructor() {
    this.router = Router();
    this.init();
  }

  public getReferenceValues(req: Request, res: Response, next: NextFunction) {
    const ds: IDataSourceSwitch = DataSourceSwitch.default;

    let name = req.query.name;
    let seed = req.query.seed;
    let group = req.query.group;

    let arrRefValueGetters: Array<Observable<ReferenceValue>> = [];

    ds.dataSource
      .getReferenceValues(name, seed, group)
      .subscribe(refValues => {
        // Now we have ref values

        if (refValues) {
          let arrayRefValues = [];

          if (Array.isArray(refValues)) {
            arrayRefValues = refValues;
          } else {
            arrayRefValues.push(refValues);
          }

          // Loop through RefValues Returned
          arrayRefValues.forEach(refValue => {
            // Call Populate RefValues

            let refObs = ReferenceValuesRouter.populateReferenceValue(refValue, seed)

            arrRefValueGetters.push(refObs);
          });
        }

        if (arrRefValueGetters.length > 0) {
          forkJoin(arrRefValueGetters).subscribe(results => {
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
      .addReferenceValue(req.body as ReferenceValue)
      .subscribe(
        val => {
          res.json(val);
        },
        err => {}
      );
  }

  private static populateReferenceValue  (refValue: ReferenceValue, seed: string): Observable<ReferenceValue> {
    return new Observable<ReferenceValue>(observer => {
      const ds: IDataSourceSwitch = DataSourceSwitch.default;

      // Data Comes from somewhere else
      if (refValue.dataSourceName) {
        // Go Fetch
        ds.dataSource
          .getDataSource(refValue.dataSourceName)
          .subscribe(dataSouorce => {
            switch (dataSouorce.type) {
              
              case BaseDataSource.TypesRestApi: {
                RESTApiHandler.runCommand(refValue.dataSourceName, {
                  seed: seed
                }).subscribe(dataResults => {
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
                  observer.next(refValue);
                  observer.complete();
                });

                break;
              }

              case BaseDataSource.TypesKumulos: {
                let kumulosDetails = dataSouorce.dataSourceDetails as RestApiDataSource;
                KumulosDataService.callFunction(kumulosDetails.url,null,null)
                .subscribe(dataResults => {
                  refValue.referenceValueItems = [];
                  let idCount = 0;
                  dataResults.forEach(item => {
                    refValue.referenceValueItems.push({
                      value: item[refValue.valueProperty],
                      display: item[refValue.displayProperty],
                      itemOrder: item[refValue.itemOrderProperty],
                      subtitle: item[refValue.subtitleProperty]
                    });
                  });
                  observer.next(refValue);
                  observer.complete();
                });

                break;
              }
            }
          });
      } else {
        observer.next(refValue);
        observer.complete();
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
