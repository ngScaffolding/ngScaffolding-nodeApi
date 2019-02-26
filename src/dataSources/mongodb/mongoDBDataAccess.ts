
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
  saveDataSource(dataSource: BaseDataSource): Promise<BaseDataSource> { 
    return DB.saveDataSource(dataSource);
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

  // //////////////////////////////////////////////////////////////////
  //
  // Reference Values
  //
  // //////////////////////////////////////////////////////////////////
  public getReferenceValue(name: string): Promise<ReferenceValue> {
      return DB.getReferenceValueByName(name);
  }

  public saveReferenceValue(referenceValue: ReferenceValue): Promise<ReferenceValue> {
    return DB.saveReferenceValue(referenceValue);
  }

  // User Prefs
  getUserPreferenceDefinitions(): Promise<UserPreferenceDefinition[]> {
    return DB.getUserPreferenceDefinitions();
  }
  saveUserPreferenceDefinition(userPreferenceDefinition: UserPreferenceDefinition): Promise<UserPreferenceDefinition>{
    return DB.saveUserPreferenceDefinition(userPreferenceDefinition);
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
