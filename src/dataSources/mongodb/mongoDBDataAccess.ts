import { MongoClient, Db } from 'mongodb';
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
} from '../../models/index';

var winston = require('../../config/winston');


export class MongoDBDataAccess implements IDataAccessLayer {
  private mongoClient: MongoClient;
  private mongoDb: Db;
  private dbDatabaseName: string;
  private dbUsersTableName: string;
  
  constructor() {
    this.dbDatabaseName = process.env['DB_AUTH_DATABASE_NAME'] || 'configuration';

    MongoClient.connect(process.env['DB_HOST']).then(
      mongoClient => {
          this.mongoClient = mongoClient;
          this.mongoDb = this.mongoClient.db(this.dbDatabaseName);

          winston.info('mongoDb default connection open');
      },
      err => {
          winston.error(err, `Error connecting to Mongodb`);
      }
  );

  // If the Node process ends, close the mongoDb connection
  process.on('SIGINT', () => {
      this.mongoClient.close(() => {
          winston.info('mongoDb default connection disconnected through app termination');
          process.exit(0);
      });
  });
  }
  getAllProfiles(): Promise<UserPreferenceValue[]> {
    throw new Error("Method not implemented.");
  }
  
  // Application Log
  async saveApplicationLog(applictionLog: ApplicationLog): Promise<ApplicationLog> {
    let result = await this.mongoDb.collection('applicationLogs').insertOne(applictionLog);
    return applictionLog;
  }

  // //////////////////////////////////////////////////////////////////
  //
  // Roles Section
  //
  // //////////////////////////////////////////////////////////////////
  async getRoles(): Promise<Role[]> {
    
    return this.mongoDb.collection('roles').find({}).toArray();
  }
  async deleteRole(name: string): Promise<any> {
    
    return this.mongoDb.collection('roles').deleteOne({name: name});
  }

  async addRole(role: Role): Promise<any> {
    
    return this.mongoDb.collection('roles').insertOne(role);
  }

  async updateRole(role: Role): Promise<any> {
    
    return this.mongoDb.collection('roles').findOneAndUpdate({name: role.name}, role);
  }

  // //////////////////////////////////////////////////////////////////
  //
  // AppSettings  
  //
  // //////////////////////////////////////////////////////////////////
  async getAppSettingsValues(): Promise<AppSettingsValue[]>{
    return this.mongoDb.collection('applicationSettings').find({}).toArray();
  }

  // //////////////////////////////////////////////////////////////////
  //
  // Widgets  
  //
  // //////////////////////////////////////////////////////////////////
  async getWidget(name: string): Promise<WidgetModelBase> {
    return this.mongoDb.collection('widgets').findOne({name: name});
 }

  async getAllWidgets(): Promise<WidgetModelBase[]> {
    return this.mongoDb.collection('widgets').find({}).toArray();
  }

  // //////////////////////////////////////////////////////////////////
  //
  // DataSource  
  //
  // //////////////////////////////////////////////////////////////////
  async getDataSource(name: string): Promise<BaseDataSource> {
    return this.mongoDb.collection('dataSources').findOne({name: name});
  }

  async saveDataSource(dataSource: BaseDataSource): Promise<BaseDataSource> { 
    return (await this.mongoDb.collection('dataSources').findOneAndUpdate({name: dataSource.name}, dataSource)).value;
  }

  // //////////////////////////////////////////////////////////////////
  //
  // Error  
  //
  // //////////////////////////////////////////////////////////////////
  async saveError(error: ErrorModel): Promise<any> {
    return await this.mongoDb.collection('errors').insertOne(error);
  }

  // //////////////////////////////////////////////////////////////////
  //
  // MenuItems  
  //
  // //////////////////////////////////////////////////////////////////
  async getMenuItem(name: string): Promise<CoreMenuItem> {
    return this.mongoDb.collection('menuItems').findOne({name: name});
 }

  async getMenuItems(): Promise<CoreMenuItem[]> {
    return this.mongoDb.collection('menuItems').find({}).toArray();
  }

  async saveMenuItem(menuItem: CoreMenuItem): Promise<CoreMenuItem> {
    return (await this.mongoDb.collection('dataSources').findOneAndUpdate({name: menuItem.name}, menuItem)).value;
  }

  async deleteMenuItem(name: string): Promise<any> {
    return this.mongoDb.collection('dataSources').deleteOne({name: name});
  }

  // //////////////////////////////////////////////////////////////////
  //
  // Reference Values
  //
  // //////////////////////////////////////////////////////////////////
  async getReferenceValue(name: string): Promise<ReferenceValue> {
    
    return this.mongoDb.collection('referenceValues').findOne({name: name});
  }

  async saveReferenceValue(referenceValue: ReferenceValue): Promise<ReferenceValue> {
    
    return (await this.mongoDb.collection('referenceValues').findOneAndUpdate({name: referenceValue.name}, referenceValue)).value;
  }

  // User Prefs
  async getUserPreferenceDefinitions(): Promise<UserPreferenceDefinition[]> {
    return this.mongoDb.collection('userPreferenceDefinitions').find({}).toArray();
  }

  async saveUserPreferenceDefinition(userPreferenceDefinition: UserPreferenceDefinition): Promise<UserPreferenceDefinition>{
    return (await this.mongoDb.collection('userPreferenceDefinitions').findOneAndUpdate({name: userPreferenceDefinition.name}, userPreferenceDefinition)).value;
  }

  async saveUserPreferenceValue(userPreference: UserPreferenceValue): Promise<UserPreferenceValue> {
    
    return (await this.mongoDb.collection('userPreferenceValues').findOneAndUpdate({name: userPreference.name}, userPreference)).value;

  }
  async deleteUserPreferenceValue(userId: string, name: string): Promise<any> {
    
    return this.mongoDb.collection('userPreferenceValues').findOneAndDelete({name:name});
  }
  async getUserPreferenceValues(userId: string): Promise<UserPreferenceValue[]> {
    return this.mongoDb.collection('userPreferenceValues').find({}).toArray();
  }
}
