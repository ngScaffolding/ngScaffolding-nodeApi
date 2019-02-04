
import { IDataAccessLayer } from '../dataAccessLayer';
import { Observable } from 'rxjs';
import {
  BaseDataSource,
  ApplicationLog,
  CoreMenuItem,
  ErrorModel,
  UserPreferenceDefinition,
  ReferenceValue,
  UserPreferenceValue,
  WidgetModelBase,
  AppSettingsValue
} from '@ngscaffolding/models';
import { stringify } from 'querystring';

var azure = require('azure-storage');

require('dotenv').config();

const uuidv4 = require('uuid/v4');

export class AzureStorageDataAccess implements IDataAccessLayer {
  private tablePrefix = '';

  constructor() {
    // Are we prefixing table names?
    if (process.env.TABLE_PREFIX) {
      this.tablePrefix = process.env.TABLE_PREFIX;
    }

    // Create tables if not present
    var tableService = azure.createTableService();
    tableService.createTableIfNotExists(`${this.tablePrefix}applicationlogs`, (error, result, response) => {});
    tableService.createTableIfNotExists(`${this.tablePrefix}appsettings`, (error, result, response) => {});
    tableService.createTableIfNotExists(`${this.tablePrefix}datasources`, (error, result, response) => {});
    tableService.createTableIfNotExists(`${this.tablePrefix}errors`, (error, result, response) => {});
    tableService.createTableIfNotExists(`${this.tablePrefix}menuitems`, (error, result, response) => {});
    tableService.createTableIfNotExists(`${this.tablePrefix}referencevalues`, (error, result, response) => {});
    tableService.createTableIfNotExists(`${this.tablePrefix}userpreferencedefinitions`, (error, result, response) => {});
    tableService.createTableIfNotExists(`${this.tablePrefix}userpreferencevalues`, (error, result, response) => {});
    tableService.createTableIfNotExists(`${this.tablePrefix}widgets`, (error, result, response) => {});
  }

  // //////////////////////////////////////////////////////////////////
  //
  // Application Log Section
  //
  // //////////////////////////////////////////////////////////////////
  saveApplicationLog(applicationLog: ApplicationLog): Observable<ApplicationLog> {
    var tableService = azure.createTableService();
    var entity = {
      PartitionKey: '',
      RowKey: uuidv4(),
      data: JSON.stringify(applicationLog)
    };

    return new Observable<ApplicationLog>(observer => {
      tableService.insertEntity(`${this.tablePrefix}applicationlogs`, entity, (error, result, response) => {
        if (!error) {
          observer.next(result);
          observer.complete();
        } else {
        }
      });
    });
  }

  // //////////////////////////////////////////////////////////////////
  //
  // AppSettings Secion
  //
  // //////////////////////////////////////////////////////////////////
  getAppSettingsValues(): Observable<AppSettingsValue[]> {
    var tableService = azure.createTableService();
    var query = new azure.TableQuery().where('PartitionKey eq ?', '');

    return new Observable<AppSettingsValue[]>(observer => {
      tableService.queryEntities(`${this.tablePrefix}appsettings`, query, null, (error, results, response) => {
        if (!error) {
          let returnValues: AppSettingsValue[] = [];
          results.entries.forEach(result => {
            const name = result.RowKey['_'];
            const entity = result.value['_'];
            returnValues.push({ Id: null, name: name, value: entity });
          });
          observer.next(returnValues);
          observer.complete();
        } else {
          observer.error();
        }
      });
    });
  }

  // //////////////////////////////////////////////////////////////////
  //
  // Data Source Section
  //
  // //////////////////////////////////////////////////////////////////
  getDataSource(name: string): Observable<BaseDataSource> {
    var tableService = azure.createTableService();

    return new Observable<BaseDataSource>(observer => {
      tableService.retrieveEntity(`${this.tablePrefix}datasources`, '', name, (error, result, response) => {
        if (!error) {
          const entity = JSON.parse(result.data['_']);
          observer.next(entity);
          observer.complete();
        } else {
          observer.error();
        }
      });
    });
  }

  // //////////////////////////////////////////////////////////////////
  //
  // Widget Section
  //
  // //////////////////////////////////////////////////////////////////
  getAllWidgets(): Observable<WidgetModelBase[]> {
    var tableService = azure.createTableService();
    var query = new azure.TableQuery().where('PartitionKey eq ?', '');

    return new Observable<WidgetModelBase[]>(observer => {
      tableService.queryEntities(`${this.tablePrefix}widgets`, query, null, (error, results, response) => {
        if (!error) {
          let returnValues: WidgetModelBase[] = [];
          results.entries.forEach(result => {
            const entity = JSON.parse(result.data['_']);
            returnValues.push(entity);
          });
          observer.next(returnValues);
          observer.complete();
        } else {
          observer.error();
        }
      });
    });
  }

  getWidget(name: string): Observable<WidgetModelBase> {
    var tableService = azure.createTableService();

    return new Observable<WidgetModelBase>(observer => {
      tableService.retrieveEntity(`${this.tablePrefix}widgets`, '', name, (error, result, response) => {
        if (!error) {
          const entity = JSON.parse(result.data['_']);
          observer.next(entity);
          observer.complete();
        } else {
          observer.error();
        }
      });
    });
  }

  // //////////////////////////////////////////////////////////////////
  //
  // Error Section
  //
  // //////////////////////////////////////////////////////////////////
  saveError(error: ErrorModel): void {
    var tableService = azure.createTableService();
    var entity = {
      PartitionKey: '',
      RowKey: uuidv4(),
      data: JSON.stringify(error)
    };
    tableService.insertEntity(`${this.tablePrefix}errors`, entity, (error, result, response) => {});
  }

  // //////////////////////////////////////////////////////////////////
  //
  // MenuItems Section
  //
  // //////////////////////////////////////////////////////////////////
  getMenuItem(name: string): Observable<CoreMenuItem> {
    var tableService = azure.createTableService();

    return new Observable<CoreMenuItem>(observer => {
      tableService.retrieveEntity(`${this.tablePrefix}menuitems`, '', name, (error, result, response) => {
        if (!error) {
          const entity = JSON.parse(result.data['_']);
          observer.next(entity);
          observer.complete();
        } else {
          observer.next(null);
          observer.complete();
        }
      });
    });
  }
  getMenuItems(): Observable<CoreMenuItem[]> {
    var tableService = azure.createTableService();
    var query = new azure.TableQuery().where('PartitionKey eq ?', '');

    return new Observable<CoreMenuItem[]>(observer => {
      tableService.queryEntities(`${this.tablePrefix}menuitems`, query, null, (error, results, response) => {
        if (!error) {
          let returnValues: CoreMenuItem[] = [];
          results.entries.forEach(result => {
            const entity = JSON.parse(result.data['_']);
            returnValues.push(entity);
          });
          observer.next(returnValues);
          observer.complete();
        } else {
          observer.error();
        }
      });
    });
  }
  saveMenuItem(menuItem: CoreMenuItem): Observable<CoreMenuItem> {
    var tableService = azure.createTableService();

    return new Observable<CoreMenuItem>(observer => {
      // Find if exists
      this.getMenuItem(menuItem.name).subscribe(menu => {
        if (menu) {
          var entity = {
            PartitionKey: '',
            RowKey: menuItem.name,
            data: JSON.stringify(menuItem)
          };
          tableService.replaceEntity(`${this.tablePrefix}menuitems`, entity, function(error, result, response) {
            if (!error) {
              // Entity updated
              observer.next(menuItem);
              observer.complete();
            } else {
              observer.error(error);
            }
          });
        } else {
          // Insert Time
          var entity = {
            PartitionKey: '',
            RowKey: menuItem.name,
            data: JSON.stringify(menuItem)
          };
          tableService.insertEntity(`${this.tablePrefix}menuitems`, entity, function(error, result, response) {
            if (!error) {
              // Entity updated
              observer.next(menuItem);
              observer.complete();
            } else {
              observer.error(error);
            }
          });
        }
      });
    });
  }
  deleteMenuItem(name: string): Observable<any> {
    return new Observable<CoreMenuItem>(observer => {
      var tableService = azure.createTableService();
      var entity = {
        PartitionKey: '',
        RowKey: name
      };
      tableService.deleteEntity(`${this.tablePrefix}menuitems`, entity, function (error, response) {
        if (!error) {
          // Entity deleted
          observer.next();
          observer.complete();
        } else {
          observer.error(error);
        }
      });
    });
  }
  // //////////////////////////////////////////////////////////////////
  //
  // Reference Values Section
  //
  // //////////////////////////////////////////////////////////////////
  getReferenceValues(name: string, seed: string, group: string): Observable<ReferenceValue[]> {
    var tableService = azure.createTableService();
    var returnValues: ReferenceValue[] = [];

    return new Observable<ReferenceValue[]>(observer => {
      if (group) {
        var query = new azure.TableQuery().where('PartitionKey eq ?', '');

        tableService.queryEntities(`${this.tablePrefix}referencevalues`, query, null, (error, results, response) => {
          if (!error) {
            results.entries.forEach(result => {
              const entity: ReferenceValue = JSON.parse(result.data['_']);
              if (entity.groupName.toLowerCase() === group.toLowerCase()) {
                returnValues.push(entity);
              }
            });
            observer.next(returnValues);
            observer.complete();
          } else {
            observer.error();
          }
        });
      } else if (seed) {
        observer.error('Not Implemented');
      } else {
        // Just get by name
        tableService.retrieveEntity(`${this.tablePrefix}referencevalues`, '', name, (error, result, response) => {
          if (!error) {
            const entity = JSON.parse(result.data['_']);
            observer.next(entity);
            observer.complete();
          } else {
            observer.error();
          }
        });
      }
    });
  }
  addReferenceValue(referenceValue: ReferenceValue): Observable<ReferenceValue> {
    throw new Error('Method not implemented.');
  }
  getUserPreferenceDefinitions(): Observable<UserPreferenceDefinition[]> {
    var tableService = azure.createTableService();
    var query = new azure.TableQuery().where('PartitionKey eq ?', '');

    return new Observable<UserPreferenceDefinition[]>(observer => {
      tableService.queryEntities(`${this.tablePrefix}userpreferencedefinitions`, query, null, (error, results, response) => {
        if (!error) {
          let returnValues: UserPreferenceDefinition[] = [];
          results.entries.forEach(result => {
            const entity = JSON.parse(result.data['_']);
            returnValues.push(entity);
          });
          observer.next(returnValues);
          observer.complete();
        } else {
          observer.error();
        }
      });
    });
  }
  getUserPreferenceValues(userId: string): Observable<UserPreferenceValue[]> {
    var tableService = azure.createTableService();
    var query = new azure.TableQuery().where('RowKey ge ?', userId);

    return new Observable<UserPreferenceValue[]>(observer => {
      tableService.queryEntities(`${this.tablePrefix}userpreferencevalues`, query, null, (error, results, response) => {
        if (!error) {
          let returnValues: UserPreferenceValue[] = [];
          results.entries.forEach(result => {
            const entity: UserPreferenceValue = JSON.parse(result.data['_']);
            returnValues.push(entity);
          });
          observer.next(returnValues);
          observer.complete();
        } else {
          observer.error();
        }
      });
    });
  }
  saveUserPreferenceValue(userPreference: UserPreferenceValue): Observable<UserPreferenceValue> {
    var tableService = azure.createTableService();

    return new Observable<UserPreferenceValue>(observer => {
      // Find if exists
      this.getUserPreferenceValues(userPreference.userId).subscribe(prefs => {
        const searchKey = this.getUserPrefKey(userPreference.userId, userPreference.name)

        let existingPref = prefs.find(pref => pref.name.toLowerCase() === userPreference.name.toLowerCase() && 
          pref.userId.toLowerCase() === userPreference.userId.toLowerCase());
        if (existingPref) {
          var entity = {
            PartitionKey: '',
            RowKey: searchKey,
            data: JSON.stringify(userPreference)
          };
          tableService.replaceEntity(`${this.tablePrefix}userpreferencevalues`, entity, function(error, result, response) {
            if (!error) {
              // Entity updated
              observer.next(existingPref);
              observer.complete();
            } else {
              observer.error(error);
            }
          });
        } else {
          // Insert Time
          var entity = {
            PartitionKey: '',
            RowKey: this.getUserPrefKey(userPreference.userId, userPreference.name),
            data: JSON.stringify(userPreference)
          };
          tableService.insertEntity(`${this.tablePrefix}userpreferencevalues`, entity, function(error, result, response) {
            if (!error) {
              // Entity updated
              observer.next(existingPref);
              observer.complete();
            } else {
              observer.error(error);
            }
          });
        }
      });
    });
  }

  private getUserPrefKey(userId: string, name: string): string {
    return `${userId}::${name}`;
  }

  deleteUserPreferenceValue(userId: any, string: any, name: string): Observable<any> {
    throw new Error('Method not implemented.');
  }
}
