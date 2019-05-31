import { DocumentDBClient, databaseLink } from 'documentdb';

export class DocumentDBUtils {
  executeQuery(client: DocumentDBClient, databaseName: string, collectionName: string, query: string): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      this.getOrCreateDatabase(client, databaseName).then(dataBase=>{
        this.getOrCreateCollection(client, dataBase._self, collectionName).then(collection => {
          client.queryDocuments(collection._self, query, { enableCrossPartitionQuery: true }).toArray((err, results) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(results);
                    
                }
            });
        });
      });
    });
  }

  getOrCreateDatabase(client: DocumentDBClient, databaseName: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
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
          reject(err);
        } else {
          if (results.length === 0) {
            var databaseSpec = {
              id: databaseName
            };

            client.createDatabase(databaseSpec, function(err, created) {
              if (err) {
                reject(err);
              } else {
                resolve(created);
                
              }
            });
          } else {
            resolve(results[0]);
            
          }
        }
      });
    });
  }

  getOrCreateCollection(client, databaseLink, collectionId): Promise<any> {
      return new Promise<any>((resolve, reject)=>{
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
              reject(err);
            } else {
              if (results.length === 0) {
                var collectionSpec = {
                  id: collectionId
                };
      
                client.createCollection(databaseLink, collectionSpec, function(err, created) {
                  resolve(created);
                  
                });
              } else {
                resolve(results[0]);
                
              }
            }
          });
      });
    }
}
