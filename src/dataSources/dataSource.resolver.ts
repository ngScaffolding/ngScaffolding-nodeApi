import { Router, Request, Response, NextFunction } from 'express';
import { IDataSourceSwitch } from '../dataSourceSwitch';
import { DataSourceRequest, DataSourceTypes } from '../models/index';
import { RESTApiHandler } from '../utils/restApi.dataSource';
import { DataSourceHelper } from '../utils/dataSource.helper';
import { SQLCommandHandler } from '../utils/mssql.dataSource';
import { DocumentDBCommandHandler } from '../utils/documentDB.dataSource';
import { MongoDBCommandHandler } from '../utils/mongoDB.dataSource';

import { CacheService } from '../utils/cache.service';
var DataSourceSwitch = require('../dataSourceSwitch');
const winston = require('../config/winston');

export class DataSourceResolver {
    private static readonly dataSourceCachePrefix = 'DataSource_';
    private static ttl = 10 * 60 * 1; // cache for 10 Mins
    private static cacheService = new CacheService(DataSourceResolver.ttl); // Create a new cache service instance

    public static async resolve(dataRequest: DataSourceRequest, request: Request): Promise<any> {
            const ds: IDataSourceSwitch = DataSourceSwitch.default;

            // If we have a seed value add it into the inputData
            if (dataRequest.seed) {
                if (dataRequest.inputData) {
                    dataRequest.inputData['seed'] = dataRequest.seed;
                } else {
                    dataRequest.inputData = { seed: dataRequest.seed };
                }
            }

            // If we have filterValues addem in
            if (dataRequest.filterValues) {
                if (dataRequest.inputData) {
                    dataRequest.inputData = dataRequest.filterValues;
                } else {
                    dataRequest.inputData = { ...dataRequest.filterValues, ...dataRequest.inputData };
                }
            }

            let dataSource = await this.cacheService.get(`${this.dataSourceCachePrefix}${dataRequest.name}`, () => {
                 return ds.dataSource.getDataSource(dataRequest.name);
            });

            // let dataSource = await ds.dataSource.getDataSource(dataRequest.name);

            switch (dataSource.type) {
                case DataSourceTypes.RestApi: {
                    let details = DataSourceHelper.prepareInputAndRows(dataRequest.inputData, dataRequest.rowData);

                    RESTApiHandler.runCommand(
                        dataSource,
                        details.inputDetails,
                        details.rows,
                        request.headers.authorization,
                        dataRequest.body
                    )
                        .then(
                            dataResults => {
                                dataResults.expiresSeconds = dataSource.expires;
                                dataResults.success = true;
                                return dataResults;
                            });
                    break;
                }

                case DataSourceTypes.MySQL: {
                    break;
                }

                case DataSourceTypes.MongoDB: {
                    let details = DataSourceHelper.prepareInputAndRows(dataRequest.inputData, dataRequest.rowData);

                    MongoDBCommandHandler.runCommand(dataSource, details.inputDetails, details.rows)
                        .then(
                            dataResults => {
                                dataResults.expiresSeconds = dataSource.expires;
                                dataResults.success = true;
                                return dataResults;
                            });
                    break;
                }

                case DataSourceTypes.SQL: {
                    let details = DataSourceHelper.prepareInputAndRows(dataRequest.inputData, dataRequest.rowData);

                    SQLCommandHandler.runCommand(dataSource, details.inputDetails, details.rows)
                        .then(
                            dataResults => {
                                dataResults.expiresSeconds = dataSource.expires;
                                dataResults.success = true;
                                return dataResults;
                            });
                    break;
                }

                case DataSourceTypes.DocumentDB: {
                    let details = DataSourceHelper.prepareInputAndRows(dataRequest.inputData, dataRequest.rowData);

                    DocumentDBCommandHandler.runCommand(dataSource, details.inputDetails, details.rows)
                        .then(
                            dataResults => {
                                dataResults.expiresSeconds = dataSource.expires;
                                dataResults.success = true;
                                return dataResults;
                            });

                    break;
                }
            }
    }
}
