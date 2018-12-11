import { Observable } from 'rxjs';
import { DocumentDBClient, databaseLink } from 'documentdb';

export class DocumentDBUtils {
  executeQuery(client: DocumentDBClient, databaseName: string, collectionName: string, query: string): Observable<any[]> {
    return new Observable<any[]>(observer => {
      this.getOrCreateDatabase(client, databaseName).subscribe(dataBase=>{
        this.getOrCreateCollection(client, dataBase._self, collectionName).subscribe(collection => {
            client.queryDocuments(collection._self,{}).toArray((err, results) => {
                if(err) {
                    observer.error(err);
                } else {
                    observer.next(results);
                    observer.complete();
                }
            });
        });
      });
    });
  }

  getOrCreateDatabase(client: DocumentDBClient, databaseName: string): Observable<any> {
    return new Observable<any>(observer => {
      var querySpec = {
        query: 'SELECT * FROM root r WHERE r.id= @id',
        parameters: [
          {
            name: '@id',
            value: databaseName
          }
        ]
      };

      client.queryDatabases(querySpec).toArray(function(err, results) {
        if (err) {
          observer.error(err);
        } else {
          if (results.length === 0) {
            var databaseSpec = {
              id: databaseName
            };

            client.createDatabase(databaseSpec, function(err, created) {
              if (err) {
                observer.error(err);
              } else {
                observer.next(created);
                observer.complete();
              }
            });
          } else {
            observer.next(results[0]);
            observer.complete();
          }
        }
      });
    });
  }

  getOrCreateCollection(client, databaseLink, collectionId): Observable<any> {
      return new Observable<any>(observer=>{
        var querySpec = {
            query: 'SELECT * FROM root r WHERE r.id=@id',
            parameters: [
              {
                name: '@id',
                value: collectionId
              }
            ]
          };
      
          client.queryCollections(databaseLink, querySpec).toArray(function(err, results) {
            if (err) {
              observer.error(err);
            } else {
              if (results.length === 0) {
                var collectionSpec = {
                  id: collectionId
                };
      
                client.createCollection(databaseLink, collectionSpec, function(err, created) {
                  observer.next(created);
                  observer.complete();
                });
              } else {
                observer.next(results[0]);
                observer.complete();
              }
            }
          });
      });
    }
}
