import { IDataSourceSwitch } from '../dataSourceSwitch';
import { Observable ,  forkJoin } from 'rxjs';
import { DocumentDBDataSource, DataResults } from '@ngscaffolding/models';
import { DataSourceHelper } from './dataSource.helper';
import { DocumentDBUtils } from './documentDB.utils';


require('dotenv').config();
var DataSourceSwitch = require('../dataSourceSwitch');
var DocumentDBClient = require("documentdb").DocumentClient;


export class DocumentDBCommandHandler {
  public static runCommand(dataSourceName: string|string[], inputDetails: any = undefined, rows: any[] = [{}]): Observable<any> {
    return new Observable<any>(observer => {
      const ds: IDataSourceSwitch = DataSourceSwitch.default;

      // Get dataSource
      ds.dataSource.getDataSource(dataSourceName).subscribe(dataSouorce => {
        let obsCollection: Array<Observable<any>> = [];

        let docDBSource = dataSouorce.dataSourceDetails as DocumentDBDataSource;

        // Load the connection string
        let connString = process.env['CONN_' + docDBSource.connection];
        let connKey = process.env['CONN_' + docDBSource.connection + '_KEY'];
        
        if(!connString) {
            // If failed Try again without the prefix
            connString = process.env[docDBSource.connection];
        }
        if(!connKey) {
            // If failed Try again without the prefix
            connKey = process.env[docDBSource.connection + '_KEY'];
        }

        // Return value ready
        let dataResults: DataResults = {
          expiresSeconds: 0,
          rowCount: 0,
          jsonData: '',
          results: [{ success: true, message: '' }]
        };

        // Setup Client Object
        var docDbClient = new DocumentDBClient(connString, {masterKey: connKey});

        // Call API For each Row in rows
        rows.forEach(currentRow => {
          // Replace @@value@@ from inputDetails
          let replacedCommand = DataSourceHelper.replaceValuesInString(docDBSource.sqlCommand,inputDetails);

          // Replace @@value@@ from currentRow
          replacedCommand = DataSourceHelper.replaceValuesInString(replacedCommand,currentRow);

          // TODO: Support for SQL Parameters
          // TODO: Support for Paging

          var docDB = new DocumentDBUtils();

          obsCollection.push(
                    docDB.executeQuery(docDbClient, docDBSource.databaseName, docDBSource.collectionName, replacedCommand)
          );
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
