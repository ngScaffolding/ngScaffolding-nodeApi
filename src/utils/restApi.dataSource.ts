import { IDataSourceSwitch } from '../dataSourceSwitch';
import { RestApiDataSource, DataResults, NameValuePair } from '@ngscaffolding/models';
import { DataSourceHelper } from './dataSource.helper';
import { Options } from 'request';
import { Collection } from 'mongoose';

var DataSourceSwitch = require('../dataSourceSwitch');

const request = require('request');
require('request-to-curl');

export class RESTApiHandler {
  public static runCommand(dataSourceName: string | string[], inputDetails: any = undefined, rows: any[] = [{}]): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const ds: IDataSourceSwitch = DataSourceSwitch.default;

      // Get dataSource
      ds.dataSource.getDataSource(dataSourceName).then(dataSouorce => {
        let obsCollection: Array<Promise<any>> = [];

        let apiDataSource = dataSouorce.dataSourceDetails as RestApiDataSource;

        // Return value ready
        let dataResults: DataResults = {
          expiresSeconds: 0,
          rowCount: 0,
          jsonData: '',
          results: [{ success: true, message: '' }]
        };

        // Call API For each Row in rows
        rows.forEach(currentRow => {
          // Replace @@value@@ from inputDetails
          let replacedUrl = DataSourceHelper.replaceValuesInString(apiDataSource.url, inputDetails);

          // Replace @@value@@ from currentRow
          replacedUrl = DataSourceHelper.replaceValuesInString(replacedUrl, currentRow);

          // If we have a serverName, go and get the http prefix from the env
          if (apiDataSource.serverName) {
            // Load the connection string
            let serverUrl = process.env['CONN_' + apiDataSource.serverName];

            if (!serverUrl) {
              // If failed Try again without the prefix
              serverUrl = process.env[apiDataSource.serverName];
            }

            if (!!serverUrl) {
              if (!serverUrl.endsWith('/')) {
                serverUrl = serverUrl + '/';
              }
              replacedUrl = `${serverUrl}${replacedUrl}`;
            }
          }

          var options: Options = {
            url: replacedUrl,
            method: apiDataSource.verb,
            headers: {}
          };

          if (apiDataSource.verb === 'put' || apiDataSource.verb === 'post' || apiDataSource.verb === 'patch') {
            if (apiDataSource.bodyValues && apiDataSource.bodyValues.length > 0) {
              // Only copy values that are defined to body
              options.json = {};

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
              // get vaues here
              options.json = { ...currentRow, ...inputDetails };

              //options.json = true;
            }
          }

          if (apiDataSource.headerValues) {
            apiDataSource.headerValues.forEach(header => {
              options.headers[header['name']] = header['value'];
            });
          }

          obsCollection.push(
            new Promise<any>((collResolve, colReject) => {
              request(options, (err, res, body) => {
                let reqVal = res.request.req.toCurl();
                if (err) {
                  colReject(err);
                } else if (res.statusCode < 200 || res.statusCode > 299) {
                  colReject(`RESTApi Failed: StatusCode ${res.statusCode}`);
                } else {
                  dataResults.jsonData = body;
                  collResolve(dataResults);
                }
              });
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
        });
      });
    });
  }
}
