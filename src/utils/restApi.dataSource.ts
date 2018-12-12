import { IDataSourceSwitch } from '../dataSourceSwitch';
import { Observable, forkJoin } from 'rxjs';
import { RestApiDataSource, DataResults, NameValuePair } from '@ngscaffolding/models';
import { DataSourceHelper } from './dataSource.helper';
import { Options } from 'request';
import { Collection } from 'mongoose';

var DataSourceSwitch = require('../dataSourceSwitch');

const request = require('request');
require('request-to-curl');

export class RESTApiHandler {
  public static runCommand(dataSourceName: string | string[], inputDetails: any = undefined, rows: any[] = [{}]): Observable<any> {
    return new Observable<any>(observer => {
      const ds: IDataSourceSwitch = DataSourceSwitch.default;

      // Get dataSource
      ds.dataSource.getDataSource(dataSourceName).subscribe(dataSouorce => {
        let obsCollection: Array<Observable<any>> = [];

        let apiDataSource = dataSouorce.dataSourceDetails as RestApiDataSource;

        // Return value ready
        let dataResults: DataResults = {
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
            new Observable<any>(collectionObserver => {
              request(options, (err, res, body) => {
                let reqVal = res.request.req.toCurl();
                if (err) {
                  collectionObserver.error(err);
                } else if (res.statusCode < 200 || res.statusCode > 299) {
                  collectionObserver.error(`RESTApi Failed: StatusCode ${res.statusCode}`);
                } else {
                  dataResults.jsonData = body;
                  collectionObserver.next(dataResults);
                  collectionObserver.complete();
                }
              });
            })
          );

          forkJoin(obsCollection).subscribe(
            results => {
              observer.next(results[0]);
              observer.complete();
            },
            err => {
              observer.error(err);
            }
          );
        });
      });
    });
  }
}
