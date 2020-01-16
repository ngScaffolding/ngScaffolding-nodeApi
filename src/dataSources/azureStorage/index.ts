import { IDataAccessLayer } from '../dataAccessLayer';
import { BaseDataSource, ApplicationLog, CoreMenuItem, ErrorModel, UserPreferenceDefinition, ReferenceValue, UserPreferenceValue, WidgetModelBase, AppSettingsValue, Role } from '../../models/index';

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
      tableService.queryEntities(`${this.tablePrefix}roles`, query, null, (error, results, response) => {
        if (!error) {
          let returnValues: Role[] = [];
          try {
            results.entries.forEach(result => {
              const entity = JSON.parse(result.data['_']);
              returnValues.push(entity);
            });
            resolve(returnValues);
          } catch (error) {
            reject(error);
          }
        } else {
          reject(error);
        }
      });
    });
  }
  deleteRole(name: string): Promise<any> {
    var tableService = azure.createTableService();
    var entity = {
      PartitionKey: '',
      RowKey: name
    };

    return new Promise<any>((resolve, reject) => {
      tableService.deleteEntity(`${this.tablePrefix}roles`, entity, function(error, response) {
        if (!error) {
          resolve();
        } else {
          reject(error);
        }
      });
    });
  }

  addRole(role: Role): Promise<any> {
    var tableService = azure.createTableService();

    var entity = {
      PartitionKey: '',
      RowKey: role.name,
      data: JSON.stringify(role)
    };

    return new Promise<any>((resolve, reject) => {
      tableService.insertEntity(`${this.tablePrefix}roles`, entity, function(error, result, response) {
        if (!error) {
          resolve();
        } else {
          reject();
        }
      });
    });
  }

  updateRole(role: Role): Promise<any> {
    var tableService = azure.createTableService();

    var entity = {
      PartitionKey: '',
      RowKey: role.name,
      data: JSON.stringify(role)
    };

    return new Promise<any>((resolve, reject) => {
      tableService.replaceEntity(`${this.tablePrefix}roles`, entity, function(error, result, response) {
        if (!error) {
          resolve();
        } else {
          reject();
        }
      });
    });
  }

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
          try {
            results.entries.forEach(result => {
              const name = result.RowKey['_'];
              const entity = result.value['_'];
              returnValues.push({ name: name, value: entity });
            });
            resolve(returnValues);
          } catch (error) {
            reject(error);
          }
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
          let entity;
          try {
            entity = JSON.parse(result.data['_']);
          } catch (err) {
            reject(err);
          }
          resolve(entity);
        } else {
          if (error.statusCode === 404) {
            resolve(null);
          } else {
            reject(error);
          }
        }
      });
    });
  }
  saveDataSource(dataSource: BaseDataSource): Promise<BaseDataSource> {
    var tableService = azure.createTableService();

    return new Promise<BaseDataSource>((resolve, reject) => {
      var entity = {
        PartitionKey: '',
        RowKey: dataSource.name,
        data: JSON.stringify(dataSource)
      };
      // Find if exists
      this.getDataSource(dataSource.name).then(dataSource => {
        if (dataSource) {
          tableService.replaceEntity(`${this.tablePrefix}dataSources`, entity, function(error, result, response) {
            if (!error) {
              // Entity updated
              resolve(dataSource);
            } else {
              reject(error);
            }
          });
        } else {
          // Insert Time
          tableService.insertEntity(`${this.tablePrefix}dataSources`, entity, function(error, result, response) {
            if (!error) {
              // Entity updated
              resolve(dataSource);
            } else {
              reject(error);
            }
          });
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
          try {
            results.entries.forEach(result => {
              const entity = JSON.parse(result.data['_']);
              returnValues.push(entity);
            });
            resolve(returnValues);
          } catch (error) {
            reject(error);
          }
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
          try {
            const entity = JSON.parse(result.data['_']);
            resolve(entity);
          } catch (error) {
            reject(error);
          }
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
          try {
            const entity = JSON.parse(result.data['_']);
            resolve(entity);
          } catch (error) {
            reject(error);
          }
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
          try {
            results.entries.forEach(result => {
              const entity = JSON.parse(result.data['_']);
              returnValues.push(entity);
            });
            resolve(returnValues);
          } catch (error) {
            reject(error);
          }
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
  getReferenceValue(name: string): Promise<ReferenceValue> {
    var tableService = azure.createTableService();

    return new Promise<ReferenceValue>((resolve, reject) => {
      // Just get by name
      tableService.retrieveEntity(`${this.tablePrefix}referencevalues`, '', name, (error, result, response) => {
        if (!error) {
          try {
            const entity = JSON.parse(result.data['_']);
            resolve(entity);
          } catch (error) {
            reject(error);
          }
        } else {
          resolve(null);
        }
      });
    });
  }
  saveReferenceValue(referenceValue: ReferenceValue): Promise<ReferenceValue> {
    var tableService = azure.createTableService();

    return new Promise<ReferenceValue>((resolve, reject) => {
      var entity = {
        PartitionKey: '',
        RowKey: referenceValue.name,
        data: JSON.stringify(referenceValue)
      };

      // Find if exists
      this.getReferenceValue(referenceValue.name).then(foundRef => {
        if (foundRef) {
          tableService.replaceEntity(`${this.tablePrefix}referencevalues`, entity, function(error, result, response) {
            if (!error) {
              // Entity updated
              resolve(foundRef);
            } else {
              reject(error);
            }
          });
        } else {
          // Insert Time
          tableService.insertEntity(`${this.tablePrefix}referencevalues`, entity, function(error, result, response) {
            if (!error) {
              // Entity updated
              resolve(referenceValue);
            } else {
              reject(error);
            }
          });
        }
      });
    });
  }

  // //////////////////////////////////////////////////////////////////
  //
  // User Preferentce Definitions Section
  //
  // //////////////////////////////////////////////////////////////////
  getUserPreferenceDefinitions(): Promise<UserPreferenceDefinition[]> {
    var tableService = azure.createTableService();
    var query = new azure.TableQuery().where('PartitionKey eq ?', '');

    return new Promise<UserPreferenceDefinition[]>((resolve, reject) => {
      tableService.queryEntities(`${this.tablePrefix}userpreferencedefinitions`, query, null, (error, results, response) => {
        if (!error) {
          try {
            let returnValues: UserPreferenceDefinition[] = [];
            results.entries.forEach(result => {
              const entity = JSON.parse(result.data['_']);
              returnValues.push(entity);
            });
            resolve(returnValues);
          } catch (error) {
            reject(error);
          }
        } else {
          reject(error);
        }
      });
    });
  }

  saveUserPreferenceDefinition(userPreferenceDefinition: UserPreferenceDefinition): Promise<UserPreferenceDefinition> {
    var tableService = azure.createTableService();

    return new Promise<UserPreferenceDefinition>((resolve, reject) => {
      var entity = {
        PartitionKey: '',
        RowKey: userPreferenceDefinition.name,
        data: JSON.stringify(userPreferenceDefinition)
      };

      // Find if exists
      this.getUserPreferenceDefinitions().then(userPreferenceDefinitions => {
        let foundDef = userPreferenceDefinitions.find(def => def.name === userPreferenceDefinition.name);

        if (foundDef) {
          tableService.replaceEntity(`${this.tablePrefix}userpreferencedefinitions`, entity, function(error, result, response) {
            if (!error) {
              // Entity updated
              resolve(foundDef);
            } else {
              reject(error);
            }
          });
        } else {
          // Insert Time
          tableService.insertEntity(`${this.tablePrefix}userpreferencedefinitions`, entity, function(error, result, response) {
            if (!error) {
              // Entity updated
              resolve(foundDef);
            } else {
              reject(error);
            }
          });
        }
      });
    });
  }

  getAllProfiles(): Promise<UserPreferenceValue[]> {
    var tableService = azure.createTableService();
    var query = new azure.TableQuery().where('');

    return new Promise<UserPreferenceValue[]>((resolve, reject) => {
      tableService.queryEntities(`${this.tablePrefix}userpreferencevalues`, query, null, (error, results, response) => {
        if (!error) {
          try {
            let returnValues: UserPreferenceValue[] = [];
            results.entries.forEach(result => {
              if (result.RowKey['_'].endsWith('UserPrefs_Profile')) {
                const entity: UserPreferenceValue = JSON.parse(result.data['_']);
                const decoded = JSON.parse(entity.value);
                returnValues.push(decoded);
              }
            });
            resolve(returnValues);
          } catch (error) {
            reject(error);
          }
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
          try {
            let returnValues: UserPreferenceValue[] = [];
            results.entries.forEach(result => {
              const entity: UserPreferenceValue = JSON.parse(result.data['_']);
              returnValues.push(entity);
            });
            resolve(returnValues);
          } catch (error) {
            reject(error);
          }
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

        let existingPref = prefs.find(pref => pref.name.toLowerCase() === userPreference.name.toLowerCase() && pref.userId.toLowerCase() === userPreference.userId.toLowerCase());
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

  deleteUserPreferenceValue(userId: string, name: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
