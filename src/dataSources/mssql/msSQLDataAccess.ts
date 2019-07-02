

const sql = require('mssql')

export class MsSQLDataAccess { //implements IDataAccessLayer {
     // Application Log
  // public saveApplicationLog(applictionLog: ApplicationLog): Observable<ApplicationLog> {
  //   return new Observable<ApplicationLog>(observer => {
        
  //       DB.addApplicationLog(applictionLog as IApplicationLog)
  //       .then(log => {
  //         observer.next(log);
  //         observer.complete();
  //       })
  //       .catch((err: Error) => {
  //         observer.error(err);
  //         observer.complete();
  //       });
  //   });
  // }

  // // DataSource
  // getDataSource(name: string): Observable<BaseDataSource> {
  //   return Observable.fromPromise(DB.getDataSource(name));
  // }

  // // Error
  // public saveError(error: ErrorModel): Observable<ErrorModel> {
  //   return Observable.fromPromise(DB.addError(error as IError));
  // }

  // // Menu Items
  // getMenuItem(name: string): Observable<CoreMenuItem> {
  //   throw new Error('Method not implemented.');
  // }

  // getMenuItems(): Observable<CoreMenuItem[]> {
  //   return Observable.fromPromise(DB.getMenuItems());
  // }
  // saveMenuItem(menuItem: CoreMenuItem): Observable<CoreMenuItem> {
  //   throw new Error('Method not implemented.');
  // }
  // deleteMenuItem(name: string): Observable<any> {
  //   throw new Error('Method not implemented.');
  // }

  // // Reference Values
  // public getReferenceValues(name: string, seed: string, group: string): Observable<ReferenceValue[]> {
  //   if (group) {
  //     return Observable.fromPromise(DB.getReferenceValuesForGroup(group));
  //   } else if (seed) {
  //     return Observable.fromPromise(DB.getReferenceValuesByName(name));
  //   } else {
  //     return Observable.fromPromise(DB.getReferenceValuesByName(name));
  //   }
  // }

  // public addReferenceValue(referenceValue: ReferenceValue): Observable<ReferenceValue> {
  //   return new Observable<ReferenceValue>(observer => {
  //     DB.addReferenceValue(referenceValue as IReferenceValue)
  //       .then(log => {
  //         observer.next(log);
  //         observer.complete();
  //       })
  //       .catch((err: Error) => {
  //         observer.error(err);
  //         observer.complete();
  //       });
  //   });
  // }

  // // User Prefs
  // getUserPreferenceDefinitions(): Observable<UserPreferenceDefinition> {
  //   return Observable.fromPromise(DB.getUserPreferenceDefinitions());
  // }
  // saveUserPreferenceValue(name: string, value: string): Observable<UserPreferenceValue> {
  //   throw new Error('Method not implemented.');
  // }
  // deleteUserPreferenceValue(name: string): Observable<UserPreferenceValue> {
  //   throw new Error('Method not implemented.');
  // }
  // getUserPreferenceValues(): Observable<UserPreferenceValue> {
  //   throw new Error('Method not implemented.');
  //   //return Observable.fromPromise(DB.getUserPreferenceValues());
  // }
 
}
