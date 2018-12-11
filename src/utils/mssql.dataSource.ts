import { IDataSourceSwitch } from '../dataSourceSwitch';
import { Observable ,  forkJoin } from 'rxjs';
import {
  SqlDataSource,
  DataResults,
  NameValuePair
} from '@ngscaffolding/models';
import { config } from 'mssql';
import { DataSourceHelper } from './dataSource.helper';

require('dotenv').config();

var DataSourceSwitch = require('../dataSourceSwitch');

const sql = require('mssql');

export class SQLCommandHandler {
  public static runCommand(dataSourceName: string|string[], inputDetails: any = undefined, rows: any[] = [{}]): Observable<any> {
    return new Observable<any>(observer => {
      const ds: IDataSourceSwitch = DataSourceSwitch.default;

      // Get dataSource
      ds.dataSource.getDataSource(dataSourceName).subscribe(dataSouorce => {
        let obsCollection: Array<Observable<any>> = [];

        let sqlDataSource = dataSouorce.dataSourceDetails as SqlDataSource;

        // Load the connection string
        let connString = process.env['CONN_' + sqlDataSource.connection];

        if(!connString) {
            // If failed Try again without the prefix
            connString = process.env[sqlDataSource.connection];
        }

        // Return value ready
        let dataResults: DataResults = {
          rowCount: 0,
          jsonData: '',
          results: [{ success: true, message: '' }]
        };

        // Call API For each Row in rows
        rows.forEach(currentRow => {
          // Replace @@value@@ from inputDetails
          let replacedCommand = DataSourceHelper.replaceValuesInString(sqlDataSource.sqlCommand,inputDetails);

          // Replace @@value@@ from currentRow
          replacedCommand = DataSourceHelper.replaceValuesInString(replacedCommand,currentRow);

          // TODO: Support for SQL Parameters
          // TODO: Support for Paging

          obsCollection.push(
            new Observable<any>(collectionObserver => {

                new sql.ConnectionPool(connString).connect().then(pool => {
                    return pool.query(replacedCommand);
                }).then(result => {
                    dataResults.rowCount = result.recordset.length;
                    dataResults.jsonData = JSON.stringify(result.recordset);

                    collectionObserver.next(dataResults);
                    collectionObserver.complete();
                }).catch(err => {
                    collectionObserver.error(
                        `SqlCommand Failed: Message ${err.message}`
                      );
                })
              }));
        });

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
  }
}
