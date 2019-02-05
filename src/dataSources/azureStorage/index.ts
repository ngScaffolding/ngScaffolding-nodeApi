import { IDataAccessLayer } from '../dataAccessLayer';
import {
  BaseDataSource,
  ApplicationLog,
  CoreMenuItem,
  ErrorModel,
  UserPreferenceDefinition,
  ReferenceValue,
  UserPreferenceValue,
  WidgetModelBase,
  AppSettingsValue,
  Role
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
    tableService.createTableIfNotExists(`${this.tablePrefix}roles`, (error, result, response) => {});
    tableService.createTableIfNotExists(`${this.tablePrefix}userpreferencedefinitions`, (error, result, response) => {});
    tableService.createTableIfNotExists(`${this.tablePrefix}userpreferencevalues`, (error, result, response) => {});
    tableService.createTableIfNotExists(`${this.tablePrefix}widgets`, (error, result, response) => {});
  }

  // //////////////////////////////////////////////////////////////////
  //
  // Roles Section
  //
  // //////////////////////////////////////////////////////////////////
  getRoles(): Promise<Role[]> {
    var tableService = azure.createTableService();
    var query = new azure.TableQuery().where('PartitionKey eq ?', '');
    return new Promise<Role[]>((resolve, reject) => {
      tableService.queryEntities(`${this.tablePrefix}appsettings`, query, null, (error, results, response) => {
        if (!error) {
          let returnValues: Role[] = [];
          results.entries.forEach(result => {
            const entity = JSON.parse(result.data['_']);
            returnValues.push(entity);
          });
          resolve(returnValues);
        } else {
          reject(error);
        }
      });
    });
  }
  deleteRole(name: string): Promise<null> {
    var tableService = azure.createTableService();
    var entity = {
      PartitionKey: '',
      RowKey: name
    };

    return new Promise<null>((resolve, reject) => {
      tableService.deleteEntity(`${this.tablePrefix}roles`, entity, function(error, response) {
        if (!error) {
          resolve();
        } else {
          reject(error);
        }
      });
    });
  }

  addRole(role: Role): Promise<null> {
    var tableService = azure.createTableService();

    var entity = {
      PartitionKey: '',
      RowKey: role.name,
      data: JSON.stringify(role)
    };

    return new Promise<null>((resolve, reject) => {
      tableService.insertEntity(`${this.tablePrefix}roles`, entity, function(error, result, response) {
        if (!error) {
          resolve();
        } else {
          reject();
        }
      });
    });
  }

  updateRole(role: Role): Promise<null> {var tableService = azure.createTableService();

    var entity = {
      PartitionKey: '',
      RowKey: role.name,
      data: JSON.stringify(role)
    };

    return new Promise<null>((resolve, reject) => {
      tableService.replaceEntity(`${this.tablePrefix}roles`, entity, function(error, result, response) {
        if (!error) {
          resolve();
        } else {
          reject();
        }
      });
    });}

  // //////////////////////////////////////////////////////////////////
  //
  // Application Log Section
  //
  // //////////////////////////////////////////////////////////////////
  saveApplicationLog(applicationLog: ApplicationLog): Promise<ApplicationLog> {
    var tableService = azure.createTableService();
    var entity = {
      PartitionKey: '',
      RowKey: uuidv4(),
      data: JSON.stringify(applicationLog)
    };

    return new Promise<ApplicationLog>((resolve, reject) => {
      tableService.insertEntity(`${this.tablePrefix}applicationlogs`, entity, (error, result, response) => {
        if (!error) {
          resolve(result);
        } else {
          reject();
        }
      });
    });
  }

  // //////////////////////////////////////////////////////////////////
  //
  // AppSettings Secion
  //
  // //////////////////////////////////////////////////////////////////
  getAppSettingsValues(): Promise<AppSettingsValue[]> {
    var tableService = azure.createTableService();
    var query = new azure.TableQuery().where('PartitionKey eq ?', '');

    return new Promise<AppSettingsValue[]>((resolve, reject) => {
      tableService.queryEntities(`${this.tablePrefix}appsettings`, query, null, (error, results, response) => {
        if (!error) {
          let returnValues: AppSettingsValue[] = [];
          results.entries.forEach(result => {
            const name = result.RowKey['_'];
            const entity = result.value['_'];
            returnValues.push({ Id: null, name: name, value: entity });
          });
          resolve(returnValues);
        } else {
          reject(error);
        }
      });
    });
  }

  // //////////////////////////////////////////////////////////////////
  //
  // Data Source Section
  //
  // //////////////////////////////////////////////////////////////////
  getDataSource(name: string): Promise<BaseDataSource> {
    var tableService = azure.createTableService();

    return new Promise<BaseDataSource>((resolve, reject) => {
      tableService.retrieveEntity(`${this.tablePrefix}datasources`, '', name, (error, result, response) => {
        if (!error) {
          const entity = JSON.parse(result.data['_']);
          resolve(entity);
          
        } else {
          reject(error);
        }
      });
    });
  }

  // //////////////////////////////////////////////////////////////////
  //
  // Widget Section
  //
  // //////////////////////////////////////////////////////////////////
  getAllWidgets(): Promise<WidgetModelBase[]> {
    var tableService = azure.createTableService();
    var query = new azure.TableQuery().where('PartitionKey eq ?', '');

    return new Promise<WidgetModelBase[]>((resolve, reject) => {
      tableService.queryEntities(`${this.tablePrefix}widgets`, query, null, (error, results, response) => {
        if (!error) {
          let returnValues: WidgetModelBase[] = [];
          results.entries.forEach(result => {
            const entity = JSON.parse(result.data['_']);
            returnValues.push(entity);
          });
          resolve(returnValues);
          
        } else {
          reject(error);
        }
      });
    });
  }

  getWidget(name: string): Promise<WidgetModelBase> {
    var tableService = azure.createTableService();

    return new Promise<WidgetModelBase>((resolve, reject) => {
      tableService.retrieveEntity(`${this.tablePrefix}widgets`, '', name, (error, result, response) => {
        if (!error) {
          const entity = JSON.parse(result.data['_']);
          resolve(entity);
          
        } else {
          reject(error);
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
  getMenuItem(name: string): Promise<CoreMenuItem> {
    var tableService = azure.createTableService();

    return new Promise<CoreMenuItem>((resolve, reject) => {
      tableService.retrieveEntity(`${this.tablePrefix}menuitems`, '', name, (error, result, response) => {
        if (!error) {
          const entity = JSON.parse(result.data['_']);
          resolve(entity);
          
        } else {
          resolve(null);
          
        }
      });
    });
  }
  getMenuItems(): Promise<CoreMenuItem[]> {
    var tableService = azure.createTableService();
    var query = new azure.TableQuery().where('PartitionKey eq ?', '');

    return new Promise<CoreMenuItem[]>((resolve, reject) => {
      tableService.queryEntities(`${this.tablePrefix}menuitems`, query, null, (error, results, response) => {
        if (!error) {
          let returnValues: CoreMenuItem[] = [];
          results.entries.forEach(result => {
            const entity = JSON.parse(result.data['_']);
            returnValues.push(entity);
          });
          resolve(returnValues);
          
        } else {
          reject(error);
        }
      });
    });
  }
  saveMenuItem(menuItem: CoreMenuItem): Promise<CoreMenuItem> {
    var tableService = azure.createTableService();

    return new Promise<CoreMenuItem>((resolve, reject) => {
      // Find if exists
      this.getMenuItem(menuItem.name).then(menu => {
        if (menu) {
          var entity = {
            PartitionKey: '',
            RowKey: menuItem.name,
            data: JSON.stringify(menuItem)
          };
          tableService.replaceEntity(`${this.tablePrefix}menuitems`, entity, function(error, result, response) {
            if (!error) {
              // Entity updated
              resolve(menuItem);
              
            } else {
              reject(error);
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
              resolve(menuItem);
              
            } else {
              reject(error);
            }
          });
        }
      });
    });
  }
  deleteMenuItem(name: string): Promise<any> {
    return new Promise<CoreMenuItem>((resolve, reject) => {
      var tableService = azure.createTableService();
      var entity = {
        PartitionKey: '',
        RowKey: name
      };
      tableService.deleteEntity(`${this.tablePrefix}menuitems`, entity, function(error, response) {
        if (!error) {
          // Entity deleted
          resolve();
          
        } else {
          reject(error);
        }
      });
    });
  }
  // //////////////////////////////////////////////////////////////////
  //
  // Reference Values Section
  //
  // //////////////////////////////////////////////////////////////////
  getReferenceValues(name: string, seed: string, group: string): Promise<ReferenceValue[]> {
    var tableService = azure.createTableService();
    var returnValues: ReferenceValue[] = [];

    return new Promise<ReferenceValue[]>((resolve, reject) => {
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
            resolve(returnValues);
            
          } else {
            reject(error);
          }
        });
      } else if (seed) {
        reject('Not Implemented');
      } else {
        // Just get by name
        tableService.retrieveEntity(`${this.tablePrefix}referencevalues`, '', name, (error, result, response) => {
          if (!error) {
            const entity = JSON.parse(result.data['_']);
            resolve(entity);
            
          } else {
            reject(error);
          }
        });
      }
    });
  }
  addReferenceValue(referenceValue: ReferenceValue): Promise<ReferenceValue> {
    throw new Error('Method not implemented.');
  }
  getUserPreferenceDefinitions(): Promise<UserPreferenceDefinition[]> {
    var tableService = azure.createTableService();
    var query = new azure.TableQuery().where('PartitionKey eq ?', '');

    return new Promise<UserPreferenceDefinition[]>((resolve, reject) => {
      tableService.queryEntities(`${this.tablePrefix}userpreferencedefinitions`, query, null, (error, results, response) => {
        if (!error) {
          let returnValues: UserPreferenceDefinition[] = [];
          results.entries.forEach(result => {
            const entity = JSON.parse(result.data['_']);
            returnValues.push(entity);
          });
          resolve(returnValues);
          
        } else {
          reject(error);
        }
      });
    });
  }
  getUserPreferenceValues(userId: string): Promise<UserPreferenceValue[]> {
    var tableService = azure.createTableService();
    var query = new azure.TableQuery().where('RowKey ge ?', userId);

    return new Promise<UserPreferenceValue[]>((resolve, reject) => {
      tableService.queryEntities(`${this.tablePrefix}userpreferencevalues`, query, null, (error, results, response) => {
        if (!error) {
          let returnValues: UserPreferenceValue[] = [];
          results.entries.forEach(result => {
            const entity: UserPreferenceValue = JSON.parse(result.data['_']);
            returnValues.push(entity);
          });
          resolve(returnValues);
          
        } else {
          reject(error);
        }
      });
    });
  }
  saveUserPreferenceValue(userPreference: UserPreferenceValue): Promise<UserPreferenceValue> {
    var tableService = azure.createTableService();

    return new Promise<UserPreferenceValue>((resolve, reject) => {
      // Find if exists
      this.getUserPreferenceValues(userPreference.userId).then(prefs => {
        const searchKey = this.getUserPrefKey(userPreference.userId, userPreference.name);

        let existingPref = prefs.find(
          pref => pref.name.toLowerCase() === userPreference.name.toLowerCase() && pref.userId.toLowerCase() === userPreference.userId.toLowerCase()
        );
        if (existingPref) {
          var entity = {
            PartitionKey: '',
            RowKey: searchKey,
            data: JSON.stringify(userPreference)
          };
          tableService.replaceEntity(`${this.tablePrefix}userpreferencevalues`, entity, function(error, result, response) {
            if (!error) {
              // Entity updated
              resolve(existingPref);
              
            } else {
              reject(error);
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
              resolve(existingPref);
              
            } else {
              reject(error);
            }
          });
        }
      });
    });
  }

  private getUserPrefKey(userId: string, name: string): string {
    return `${userId}::${name}`;
  }

  deleteUserPreferenceValue(userId: any, string: any, name: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
