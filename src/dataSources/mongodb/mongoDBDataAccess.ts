
import { Observable, from } from 'rxjs';
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
  AppSettingsValue
} from '@ngscaffolding/models';
import { DB } from './database.mongodb';
import { IApplicationLog } from './models/applicationLog.model';
import { IError } from './models/error.model';
import { IReferenceValue } from './models/referenceValue.model';

export class MongoDBDataAccess implements IDataAccessLayer {
  // Application Log
  public saveApplicationLog(applictionLog: ApplicationLog): Observable<ApplicationLog> {
    return new Observable<ApplicationLog>(observer => {
      DB.addApplicationLog(applictionLog as IApplicationLog)
        .then(log => {
          observer.next(log);
          observer.complete();
        })
        .catch((err: Error) => {
          observer.error(err);
          observer.complete();
        });
    });
  }

  // AppSettings
  public getAppSettingsValues(): Observable<AppSettingsValue[]>{
    return from(DB.getAppSettings());
  }

  // Widget
  getWidget(name: string): Observable<WidgetModelBase> {
      return from(DB.getWidget(name));
  }
  getAllWidgets(): Observable<WidgetModelBase[]> {
    return from(DB.getAllWidgets())
  }

  // DataSource
  getDataSource(name: string): Observable<BaseDataSource> {
    return from(DB.getDataSource(name));
  }

  // Error
  public saveError(error: ErrorModel): Observable<ErrorModel> {
    return from(DB.addError(error as IError));
  }

  // Menu Items
  getMenuItem(name: string): Observable<CoreMenuItem> {
    throw new Error('Method not implemented.');
  }

  getMenuItems(): Observable<CoreMenuItem[]> {
    return from(DB.getMenuItems());
  }
  saveMenuItem(menuItem: CoreMenuItem): Observable<CoreMenuItem> {
    throw new Error('Method not implemented.');
  }
  deleteMenuItem(name: string): Observable<any> {
    throw new Error('Method not implemented.');
  }

  // Reference Values
  public getReferenceValues(name: string, seed: string, group: string): Observable<ReferenceValue[]> {
    if (group) {
      return from(DB.getReferenceValuesForGroup(group));
    } else if (seed) {
      return from(DB.getReferenceValuesByName(name));
    } else {
      return from(DB.getReferenceValuesByName(name));
    }
  }

  public addReferenceValue(referenceValue: ReferenceValue): Observable<ReferenceValue> {
    return new Observable<ReferenceValue>(observer => {
      DB.addReferenceValue(referenceValue as IReferenceValue)
        .then(log => {
          observer.next(log);
          observer.complete();
        })
        .catch((err: Error) => {
          observer.error(err);
          observer.complete();
        });
    });
  }

  // User Prefs
  getUserPreferenceDefinitions(): Observable<UserPreferenceDefinition[]> {
    return from(DB.getUserPreferenceDefinitions());
  }
  saveUserPreferenceValue(userPreference: UserPreferenceValue): Observable<UserPreferenceValue> {
    throw new Error('Method not implemented.');
  }
  deleteUserPreferenceValue(name: string): Observable<UserPreferenceValue> {
    throw new Error('Method not implemented.');
  }
  getUserPreferenceValues(userId: string): Observable<UserPreferenceValue[]> {
    
    return from(DB.getUserPreferenceValues(userId));
  }
}
