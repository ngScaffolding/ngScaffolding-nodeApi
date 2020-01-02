import { IDataSourceSwitch } from '../dataSourceSwitch';
import { SqlDataSource, DataResults, getParameterType } from '../models/index';
import { DataSourceHelper } from './dataSource.helper';

require('dotenv').config();

var DataSourceSwitch = require('../dataSourceSwitch');

const sql = require('mssql');

export class SQLCommandHandler {
    public static runCommand(
        dataSourceName: string | string[],
        inputDetails: any = undefined,
        rows: any[] = [{}]
    ): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const ds: IDataSourceSwitch = DataSourceSwitch.default;

            // Get dataSource
            ds.dataSource.getDataSource(dataSourceName).then(dataSource => {
                let obsCollection: Array<Promise<any>> = [];

                let sqlDataSource = dataSource.itemDetails as SqlDataSource;

                // Load the connection string
                let connString = process.env['CONN_' + sqlDataSource.connection];

                if (!connString) {
                    // If failed Try again without the prefix
                    connString = process.env[sqlDataSource.connection];
                }

                if (!connString) {
                    reject('Missing Connection String');
                    return;
                }

                // Return value ready
                let dataResults: DataResults = {
                    expiresSeconds: 0,
                    rowCount: 0,
                    jsonData: '',
                    results: [{ success: true, message: '' }]
                };

                // Connect to SQL
                // Use pool for each command
                new sql.ConnectionPool(connString).connect().then(pool => {
                    // Call API For each Row in rows
                    rows.forEach(currentRow => {
                        // Replace @@value## from inputDetails
                        let replacedCommand = DataSourceHelper.replaceValuesInString(
                            sqlDataSource.sqlCommand,
                            inputDetails
                        );

                        // Replace @@value## from currentRow
                        replacedCommand = DataSourceHelper.replaceValuesInString(replacedCommand, currentRow);

                        // Clear down remaining parameter values
                        replacedCommand = DataSourceHelper.clearRemainingPlaceholders(replacedCommand);

                        // TODO: Support for Paging

                        obsCollection.push(
                            new Promise<any>((colResolve, colReject) => {
                                if (sqlDataSource.isStoredProcedure) {
                                    const request = new sql.Request();
                                    if (dataSource.parameters) {
                                        dataSource.parameters.forEach(param => {
                                            let foundValue: any = null;
                                            // Default to sourceProperty
                                            let paramName = param.sourceProperty || param.name;
                                            
                                            if(inputDetails.hasOwnProperty(paramName)) {
                                                foundValue = inputDetails[paramName];
                                            }
                                            if(currentRow.hasOwnProperty(paramName)) {
                                                foundValue = currentRow[paramName];
                                            }
                                            request.input(param.name, getParameterType(param), foundValue);
                                        });
                                    }
                                    return request
                                        .execute(sqlDataSource.sqlCommand)
                                        .then(result => {
                                            if (result.recordset) {
                                                dataResults.rowCount = result.recordset.length;
                                                dataResults.jsonData = result.recordset;
                                            } else {
                                                dataResults.jsonData = '';
                                            }

                                            colResolve(dataResults);
                                        })
                                        .catch(err => {
                                            colReject(
                                                `SqlCommand Failed: Message ${err.message} -- ${replacedCommand}`
                                            );
                                        });
                                } else {
                                    return pool
                                        .query(replacedCommand)
                                        .then(result => {
                                            if (result.recordset) {
                                                dataResults.rowCount = result.recordset.length;
                                                dataResults.jsonData = result.recordset;
                                            } else {
                                                dataResults.jsonData = '';
                                            }

                                            colResolve(dataResults);
                                        })
                                        .catch(err => {
                                            colReject(
                                                `SqlCommand Failed: Message ${err.message} -- ${replacedCommand}`
                                            );
                                        });
                                }
                            })
                        );

                        Promise.all(obsCollection).then(
                            results => {
                                resolve(results[0]);
                            },
                            err => {
                                reject(err);
                            }
                        );
                    }); // for rows
                }); // get datasource
            }); // return promise
        });
    }
}
