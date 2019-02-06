
import { IDataAccessLayer } from '../dataAccessLayer';
import {
  ApplicationLog,
  BaseDataSource,
  ErrorModel,
  CoreMenuItem,
  ReferenceValue,
  UserPreferenceDefinition,
  UserPreferenceValue,
  WidgetModelBase,
  AppSettingsValue,
  Role
} from '@ngscaffolding/models';
import { DB } from './database.mongodb';
import { IApplicationLog } from './models/applicationLog.model';
import { IError } from './models/error.model';
import { IReferenceValue } from './models/referenceValue.model';

export class MongoDBDataAccess implements IDataAccessLayer {
  // Application Log
  public saveApplicationLog(applictionLog: ApplicationLog): Promise<ApplicationLog> {
    return new Promise<ApplicationLog>((resolve, reject) => {
      DB.addApplicationLog(applictionLog as IApplicationLog)
        .then(log => {
          resolve(log);
        })
        .catch((err: Error) => {
          reject(err);
        });
    });
  }

  // //////////////////////////////////////////////////////////////////
  //
  // Roles Section
  //
  // //////////////////////////////////////////////////////////////////
  getRoles(): Promise<Role[]> {
    return DB.getRoles();
  }
  deleteRole(name: string): Promise<null> {
    return DB.deleteRole(name);
  }

  addRole(role: Role): Promise<null> {
    return DB.addRole(role);
  }

  updateRole(role: Role): Promise<null> {
    return DB.updateRole(role);
  }

  // //////////////////////////////////////////////////////////////////
  //
  // AppSettings  
  //
  // //////////////////////////////////////////////////////////////////
  public getAppSettingsValues(): Promise<AppSettingsValue[]>{
    return DB.getAppSettings();
  }

  // //////////////////////////////////////////////////////////////////
  //
  // Widgets  
  //
  // //////////////////////////////////////////////////////////////////
  getWidget(name: string): Promise<WidgetModelBase> {
      return DB.getWidget(name);
  }
  getAllWidgets(): Promise<WidgetModelBase[]> {
    return DB.getAllWidgets()
  }

  // //////////////////////////////////////////////////////////////////
  //
  // DataSource  
  //
  // //////////////////////////////////////////////////////////////////
  getDataSource(name: string): Promise<BaseDataSource> {
    return DB.getDataSource(name);
  }

  // //////////////////////////////////////////////////////////////////
  //
  // Error  
  //
  // //////////////////////////////////////////////////////////////////
  public saveError(error: ErrorModel): Promise<ErrorModel> {
    return DB.addError(error as IError);
  }

  // //////////////////////////////////////////////////////////////////
  //
  // MenuItems  
  //
  // //////////////////////////////////////////////////////////////////
  getMenuItem(name: string): Promise<CoreMenuItem> {
    throw new Error('Method not implemented.');
  }

  getMenuItems(): Promise<CoreMenuItem[]> {
    return DB.getMenuItems();
  }
  saveMenuItem(menuItem: CoreMenuItem): Promise<CoreMenuItem> {
    return DB.saveMenuItem(menuItem);
  }
  deleteMenuItem(name: string): Promise<any> {
    return DB.deleteMenuItem(name);
  }

  // Reference Values
  public getReferenceValues(name: string, seed: string, group: string): Promise<ReferenceValue[]> {
    if (group) {
      return DB.getReferenceValuesForGroup(group);
    } else if (seed) {
      return DB.getReferenceValuesByName(name);
    } else {
      return DB.getReferenceValuesByName(name);
    }
  }

  public addReferenceValue(referenceValue: ReferenceValue): Promise<ReferenceValue> {
    return new Promise<ReferenceValue>((resolve, reject) => {
      DB.addReferenceValue(referenceValue as IReferenceValue)
        .then(log => {
          resolve(log);
        })
        .catch((err: Error) => {
          reject(err);
        });
    });
  }

  // User Prefs
  getUserPreferenceDefinitions(): Promise<UserPreferenceDefinition[]> {
    return DB.getUserPreferenceDefinitions();
  }
  saveUserPreferenceValue(userPreference: UserPreferenceValue): Promise<UserPreferenceValue> {
    return DB.saveUserPreferenceValue(userPreference);
  }
  deleteUserPreferenceValue(userPreference: UserPreferenceValue): Promise<UserPreferenceValue> {
    return DB.deleteUserPreferenceValue(userPreference);
  }
  getUserPreferenceValues(userId: string): Promise<UserPreferenceValue[]> {
    
    return DB.getUserPreferenceValues(userId);
  }
}
