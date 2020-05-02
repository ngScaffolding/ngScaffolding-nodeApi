import { IDataSourceSwitch } from '../dataSourceSwitch';
import { RestApiDataSource, DataResults, BaseDataSource } from '../models/index';
import { DataSourceHelper } from './dataSource.helper';
import { Options } from 'request';

var DataSourceSwitch = require('../dataSourceSwitch');

const request = require('request');
const winston = require('../config/winston');
require('request-to-curl');

export class RESTApiHandler {
    public static runCommand(
        dataSource: BaseDataSource,
        inputDetails: any = undefined,
        rows: any[],
        authHeader: string,
        body: any = undefined
    ): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const ds: IDataSourceSwitch = DataSourceSwitch.default;

            let obsCollection: Array<Promise<any>> = [];

            let apiDataSource = dataSource.itemDetails as RestApiDataSource;

            // Return value ready
            let dataResults: DataResults = {
                expiresSeconds: 0,
                rowCount: 0,
                jsonData: '',
                results: [{ success: true, message: '' }]
            };

            // By adding a row we ensure the call is made at least once
            if (rows === null) {
                rows = [{}];
            }

            // Call API For each Row in rows
            rows.forEach(currentRow => {
                // Replace @@value## from inputDetails
                let replacedUrl = DataSourceHelper.replaceValuesInString(apiDataSource.url, inputDetails);

                // Replace @@value## from currentRow
                replacedUrl = DataSourceHelper.replaceValuesInString(replacedUrl, currentRow);

                // Clear down remaining parameter values
                replacedUrl = DataSourceHelper.clearRemainingPlaceholders(replacedUrl);

                // If we have a serverName, go and get the http prefix from the env
                if (apiDataSource.serverName) {
                    // Load the connection string
                    let serverUrl = process.env['CONN_' + apiDataSource.serverName];

                    if (!serverUrl) {
                        // If failed Try again without the prefix
                        serverUrl = process.env[apiDataSource.serverName];
                    }

                    if (!!serverUrl) {
                        if (!serverUrl.endsWith('/') && !replacedUrl.startsWith('/')) {
                            serverUrl = serverUrl + '/';
                        }
                        replacedUrl = `${serverUrl}${replacedUrl}`;
                    } else {
                        reject(`Missing Config in Environment CONN_${apiDataSource.serverName}`);
                    }
                }

                const timeoutValue = dataSource.timeout || 30000;

                var options: Options = {
                    url: replacedUrl,
                    method: apiDataSource.verb,
                    headers: {},
                    json: {},
                    timeout: timeoutValue
                };

                if (authHeader) {
                    options.headers['Authorization'] = authHeader;
                }

                if (apiDataSource.verb === 'put' || apiDataSource.verb === 'post' || apiDataSource.verb === 'patch') {
                    if (apiDataSource.bodyValues && apiDataSource.bodyValues.length > 0) {
                        // Only copy values that are defined to body
                        apiDataSource.bodyValues.forEach(bodyValue => {
                            // Value coded into bodyValue
                            if (bodyValue.value) {
                                options.json[bodyValue.name] = bodyValue.value;
                            }

                            // Now if the value exists in currentRow
                            if (currentRow[bodyValue.name]) {
                                options.json[bodyValue.name] = currentRow[bodyValue.name];
                            }

                            // Finally User Input is King
                            if (inputDetails[bodyValue.name]) {
                                options.json[bodyValue.name] = inputDetails[bodyValue.name];
                            }
                        });
                    } else {
                        // If body passed start with that as the body content
                        if (body) {
                            options.json = body;
                        } else {
                            options.json = { ...currentRow, ...inputDetails };
                        }
                    }
                }

                if (apiDataSource.headerValues) {
                    apiDataSource.headerValues.forEach(header => {
                        options.headers[header['name']] = header['value'];
                    });
                }

                obsCollection.push(
                    new Promise<any>((collResolve, colReject) => {
                        request(options, (err, res, respBody) => {
                            if (err) {
                                colReject(err);
                            } else if (res.statusCode < 200 || res.statusCode > 299) {
                                colReject(new Error(`RESTApi Failed: StatusCode ${res.statusCode}`));
                            } else {
                                dataResults.jsonData = respBody;
                                collResolve(dataResults);
                            }
                        });
                    })
                );

                Promise.all(obsCollection).then(
                    results => {
                        let dataResults = results[0];
                            dataResults.expiresSeconds = dataSource.expires;
                            dataResults.success = true;
                            resolve(dataResults);
                    },
                    error => {
                        winston.error(error);
                        reject(null);
                    }
                );
            });
        });
    }
}
