
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
let MongoClient = require('mongodb').MongoClient;


export class MongoDBDataAccess implements IDataAccessLayer {

  getAllProfiles(): Promise<UserPreferenceValue[]> {
    throw new Error("Method not implemented.");
  }
  
  // Application Log
  async saveApplicationLog(applictionLog: ApplicationLog): Promise<ApplicationLog> {
    let client = await MongoClient.connect(process.env['DB_HOST']);

    // TODO: Database name here
    return client.db('configration').collection('applicationLogs').inserOne(applictionLog);
  }

  // //////////////////////////////////////////////////////////////////
  //
  // Roles Section
  //
  // //////////////////////////////////////////////////////////////////
  async getRoles(): Promise<Role[]> {
    let client = await MongoClient.connect(process.env['DB_HOST']);
    return client.db('configration').collection('roles').find({});
  }
  async deleteRole(name: string): Promise<null> {
    let client = await MongoClient.connect(process.env['DB_HOST']);
    return client.db('configration').collection('roles').deleteOne({name: name});
  }

  async addRole(role: Role): Promise<null> {
    let client = await MongoClient.connect(process.env['DB_HOST']);
    return client.db('configration').collection('roles').insertOne(role);
  }

  async updateRole(role: Role): Promise<null> {
    let client = await MongoClient.connect(process.env['DB_HOST']);
    return client.db('configration').collection('roles').findAndUpdateOne({name: role.name}, role);
  }

  // //////////////////////////////////////////////////////////////////
  //
  // AppSettings  
  //
  // //////////////////////////////////////////////////////////////////
  async getAppSettingsValues(): Promise<AppSettingsValue[]>{
    let client = await MongoClient.connect(process.env['DB_HOST']);
    return client.db('configration').collection('appSettings').find({});
  }

  // //////////////////////////////////////////////////////////////////
  //
  // Widgets  
  //
  // //////////////////////////////////////////////////////////////////
  async getWidget(name: string): Promise<WidgetModelBase> {
    let client = await MongoClient.connect(process.env['DB_HOST']);
    return client.db('configration').collection('widgets').findOne({name: name});
 }

  async getAllWidgets(): Promise<WidgetModelBase[]> {
    let client = await MongoClient.connect(process.env['DB_HOST']);
    return client.db('configration').collection('widgets').find({});

  }

  // //////////////////////////////////////////////////////////////////
  //
  // DataSource  
  //
  // //////////////////////////////////////////////////////////////////
  async getDataSource(name: string): Promise<BaseDataSource> {
    let client = await MongoClient.connect(process.env['DB_HOST']);
    return client.db('configration').collection('dataSources').findOne({name: name});
 
  }
  async saveDataSource(dataSource: BaseDataSource): Promise<BaseDataSource> { 
    let client = await MongoClient.connect(process.env['DB_HOST']);
    return client.db('configration').collection('dataSources').findAndUpdateOne({name: dataSource.name, dataSource});

  }

  // //////////////////////////////////////////////////////////////////
  //
  // Error  
  //
  // //////////////////////////////////////////////////////////////////
  async saveError(error: ErrorModel): Promise<ErrorModel> {
    let client = await MongoClient.connect(process.env['DB_HOST']);
    return client.db('configration').collection('errors').insertOne(error);

  }

  // //////////////////////////////////////////////////////////////////
  //
  // MenuItems  
  //
  // //////////////////////////////////////////////////////////////////
  async getMenuItem(name: string): Promise<CoreMenuItem> {
    let client = await MongoClient.connect(process.env['DB_HOST']);
    return client.db('configration').collection('menuItems').findOne({name: name});
 }

  async getMenuItems(): Promise<CoreMenuItem[]> {
    let client = await MongoClient.connect(process.env['DB_HOST']);
    return client.db('configration').collection('menuItems').find({});
  }
  async saveMenuItem(menuItem: CoreMenuItem): Promise<CoreMenuItem> {
    let client = await MongoClient.connect(process.env['DB_HOST']);
    return client.db('configration').collection('dataSources').findAndUpdateOne({name: menuItem.name, menuItem});

  }
  async deleteMenuItem(name: string): Promise<any> {
    let client = await MongoClient.connect(process.env['DB_HOST']);
    return client.db('configration').collection('dataSources').deleteOne({name: name});

  }

  // //////////////////////////////////////////////////////////////////
  //
  // Reference Values
  //
  // //////////////////////////////////////////////////////////////////
  async getReferenceValue(name: string): Promise<ReferenceValue> {
    let client = await MongoClient.connect(process.env['DB_HOST']);
    return client.db('configration').collection('referenceValues').findOne({name: name});
  }

  async saveReferenceValue(referenceValue: ReferenceValue): Promise<ReferenceValue> {
    let client = await MongoClient.connect(process.env['DB_HOST']);
    return client.db('configration').collection('referenceValues').findAndUpdateOne({name: referenceValue.name}, referenceValue);
  }

  // User Prefs
  async getUserPreferenceDefinitions(): Promise<UserPreferenceDefinition[]> {
    let client = await MongoClient.connect(process.env['DB_HOST']);
    return client.db('configration').collection('userPreferenceDefinitions').find({});

  }
  async saveUserPreferenceDefinition(userPreferenceDefinition: UserPreferenceDefinition): Promise<UserPreferenceDefinition>{
    let client = await MongoClient.connect(process.env['DB_HOST']);
    return client.db('configration').collection('userPreferenceDefinitions').findAndUpdateOne({name: userPreferenceDefinition.name}, userPreferenceDefinition);

  }

  async saveUserPreferenceValue(userPreference: UserPreferenceValue): Promise<UserPreferenceValue> {
    let client = await MongoClient.connect(process.env['DB_HOST']);
    return client.db('configration').collection('userPreferenceValues').find({});

  }
  async deleteUserPreferenceValue(userId: string, name: string): Promise<UserPreferenceValue> {
    let client = await MongoClient.connect(process.env['DB_HOST']);
    return client.db('configration').collection('userPreferenceValues').delete({name:name});
  }
  async getUserPreferenceValues(userId: string): Promise<UserPreferenceValue[]> {
    
    let client = await MongoClient.connect(process.env['DB_HOST']);
    return client.db('configration').collection('userPreferenceValues').find({});
  }
}
