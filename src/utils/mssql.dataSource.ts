import { IDataSourceSwitch } from '../dataSourceSwitch';
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
  public static runCommand(dataSourceName: string|string[], inputDetails: any = undefined, rows: any[] = [{}]): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const ds: IDataSourceSwitch = DataSourceSwitch.default;

      // Get dataSource
      ds.dataSource.getDataSource(dataSourceName).then(dataSouorce => {
        let obsCollection: Array<Promise<any>> = [];

        let sqlDataSource = dataSouorce.itemDetails as SqlDataSource;

        // Load the connection string
        let connString = process.env['CONN_' + sqlDataSource.connection];

        if(!connString) {
            // If failed Try again without the prefix
            connString = process.env[sqlDataSource.connection];
        }

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
          let replacedCommand = DataSourceHelper.replaceValuesInString(sqlDataSource.sqlCommand,inputDetails);

          // Replace @@value@@ from currentRow
          replacedCommand = DataSourceHelper.replaceValuesInString(replacedCommand,currentRow);

          // TODO: Support for SQL Parameters
          // TODO: Support for Paging

          obsCollection.push(
            new Promise<any>((colResolve, colReject) => {

                new sql.ConnectionPool(connString).connect().then(pool => {
                    return pool.query(replacedCommand);
                }).then(result => {
                    dataResults.rowCount = result.recordset.length;
                    dataResults.jsonData = JSON.stringify(result.recordset);

                    colResolve(dataResults);
                }).catch(err => {
                  colReject(
                        `SqlCommand Failed: Message ${err.message}`
                      );
                })
              }));
        });

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
  }
}
