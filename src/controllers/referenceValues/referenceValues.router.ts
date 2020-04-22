import { Router, Request, Response, NextFunction } from 'express';
import { ReferenceValue, DataSourceTypes, ReferenceValueItem, BasicUser } from '../../models/index';
import { IDataSourceSwitch } from '../../dataSourceSwitch';
import { RESTApiHandler } from '../../utils/restApi.dataSource';

import { SQLCommandHandler } from '../../utils/mssql.dataSource';
import { DocumentDBCommandHandler } from '../../utils/documentDB.dataSource';
import { MongoDBCommandHandler } from '../../utils/mongoDB.dataSource';

var DataSourceSwitch = require('../../dataSourceSwitch');
const winston = require('../../config/winston');

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

        let user = req['userDetails'] as BasicUser;

        ds.dataSource.getReferenceValue(name).then(
            refValue => {
                ReferenceValuesRouter.populateReferenceValue(refValue, seed, user.userId, req.headers.authorization).then(
                    refValue => {
                        res.json(refValue);
                    },
                    error => {
                        winston.error(error);
                        res.sendStatus(500);
                    }
                );
            },
            error => {
                winston.error(error);
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

    private static dataItemToReference(item: object, refValue: ReferenceValue): ReferenceValueItem {
        return {
            display: this.valueOrNull(item, refValue, 'display'),
            value: this.valueOrNull(item, refValue, 'value'),
            itemOrder: this.valueOrNull(item, refValue, 'itemOrder'),
            subtitle: this.valueOrNull(item, refValue, 'subtitle'),
            subtitle2: this.valueOrNull(item, refValue, 'subtitle2'),
            subtitle3: this.valueOrNull(item, refValue, 'subtitle3'),
            meta: this.valueOrNull(item, refValue, 'meta')
        };
    }
    private static valueOrNull(item: object, refValue: ReferenceValue, property: string) {
        let lookIn = property;
        if (refValue[lookIn + 'Property']) {
            lookIn = refValue[lookIn + 'Property'];
        }
        return item[lookIn];
    }
    private static populateReferenceValue(
        refValue: ReferenceValue,
        seed: string,
        userId: string,
        authHeader: string
    ): Promise<ReferenceValue> {
        return new Promise<ReferenceValue>((resolve, reject) => {
            const ds: IDataSourceSwitch = DataSourceSwitch.default;
            const inputValues = {seed: seed, userId: userId};

            // Data Comes from somewhere else
            if (refValue.dataSourceName) {
                // Go Fetch
                ds.dataSource.getDataSource(refValue.dataSourceName).then(
                    dataSource => {
                        switch (dataSource.type) {
                            case DataSourceTypes.SQL: {
                                SQLCommandHandler.runCommand(dataSource, inputValues).then(
                                    dataResults => {
                                        if (!dataResults) {
                                            reject();
                                        } else {
                                            let returnedItems: any[] = dataResults.jsonData;
                                            refValue.referenceValueItems = [];
                                            let idCount = 0;
                                            if (!refValue.subtitleProperty) {
                                                refValue.subtitleProperty = refValue.displayProperty;
                                            }
                                            if (!refValue.itemOrderProperty) {
                                                refValue.itemOrderProperty = refValue.displayProperty;
                                            }
                                            returnedItems.forEach(item => {
                                                refValue.referenceValueItems.push(
                                                    this.dataItemToReference(item, refValue)
                                                );
                                            });
                                            resolve(refValue);
                                        }
                                    },
                                    error => {
                                        reject(error);
                                    }
                                );
                                break;
                            }
                            case DataSourceTypes.RestApi: {
                                RESTApiHandler.runCommand(
                                    dataSource,
                                    inputValues,
                                    null,
                                    authHeader
                                ).then(
                                    dataResults => {
                                        if (!dataResults) {
                                            reject();
                                        } else {
                                            let returnedItems: any[] = dataResults.jsonData;
                                            refValue.referenceValueItems = [];
                                            let idCount = 0;
                                            returnedItems.forEach(item => {
                                                refValue.referenceValueItems.push(
                                                    this.dataItemToReference(item, refValue)
                                                );
                                            });
                                            resolve(refValue);
                                        }
                                    },
                                    error => {
                                        reject(error);
                                    }
                                );
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
