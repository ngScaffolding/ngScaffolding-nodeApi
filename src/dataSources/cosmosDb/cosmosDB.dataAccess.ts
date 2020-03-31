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
import { CosmosDBHelper } from './cosmosDB.helper';

export class CosmosDBDataAccess implements IDataAccessLayer {
    private tablePrefix = '';
    private cosmosDBHelper:CosmosDBHelper;

    private getUserPrefKey(userId: string, name: string): string {
        return `${userId}::${name}`;
    }

    constructor() {
        this.cosmosDBHelper = new CosmosDBHelper();
    }

    saveApplicationLog(applicationLog: ApplicationLog): Promise<ApplicationLog> {
        applicationLog['PartitionKey'] = 'applicationLogs';
        return this.cosmosDBHelper.addItem(applicationLog);
    }

    getAppSettingsValues(): Promise<AppSettingsValue[]> {
        return this.cosmosDBHelper.find(`SELECT * FROM c where c.partitionKey = 'applicationSettings'`);
    }

    getDataSource(name: string | string[]): Promise<BaseDataSource> {
        return this.cosmosDBHelper.getItem (name,'dataSources');
    }
    saveDataSource(dataSource: BaseDataSource): Promise<any> {
        return this.cosmosDBHelper.updateItem(dataSource, 'dataSources');
    }
    saveError(error: ErrorModel): void {
        error['PartitionKey'] = 'errors';
        this.cosmosDBHelper.addItem(error);
    }
    getMenuItem(name: string): Promise<CoreMenuItem> {
        return this.cosmosDBHelper.getItem(name,'menuItems');
    }
    getMenuItems(): Promise<CoreMenuItem[]> {
        return this.cosmosDBHelper.find(`SELECT * FROM c where c.partitionKey = 'menuItems'`);
    }
    saveMenuItem(menuItem: CoreMenuItem): Promise<any> {
        menuItem['id'] = menuItem.name;
        return this.cosmosDBHelper.upsertItem(menuItem.name, menuItem, 'menuItems');
    }
    deleteMenuItem(name: string): Promise<any> {
        return this.cosmosDBHelper.deleteItem(name, 'menuItems');
    }
    getReferenceValue(name: string): Promise<ReferenceValue> {
        return this.cosmosDBHelper.getItem(name,'menureferenceValues');
    }
    saveReferenceValue(referenceValue: ReferenceValue): Promise<ReferenceValue> {
        throw new Error('Method not implemented.');
    }
    getRoles(): Promise<Role[]> {
        throw new Error('Method not implemented.');
    }
    deleteRole(name: string): Promise<any> {
        throw new Error('Method not implemented.');
    }
    addRole(role: Role): Promise<any> {
        throw new Error('Method not implemented.');
    }
    updateRole(role: Role): Promise<any> {
        throw new Error('Method not implemented.');
    }
    getUserPreferenceDefinitions(): Promise<UserPreferenceDefinition[]> {
        return this.cosmosDBHelper.find(`SELECT * FROM c where c.partitionKey = 'userPreferenceDefinitions'`);
    }
    saveUserPreferenceDefinition(
        userPreferenceDefinition: UserPreferenceDefinition
    ): Promise<UserPreferenceDefinition> {
        throw new Error('Method not implemented.');
    }
    getUserPreferenceValues(userId: string): Promise<UserPreferenceValue[]> {
        return this.cosmosDBHelper.find(`SELECT * FROM c where c.partitionKey = 'userPreferenceValues'`);

    }
    saveUserPreferenceValue(userPreference: UserPreferenceValue): Promise<any> {
        return this.cosmosDBHelper.updateItem(userPreference, 'userPreferenceValues');
    }
    deleteUserPreferenceValue(userId: string, name: string): Promise<any> {
        return this.cosmosDBHelper.deleteItem(userId, 'userPreferenceValues');
    }
    getAllProfiles(): Promise<UserPreferenceValue[]> {
        throw new Error('Method not implemented.');
    }
    getWidget(name: string): Promise<WidgetModelBase> {
        return this.cosmosDBHelper.getItem(name,'widgets');
    }
    getAllWidgets(): Promise<WidgetModelBase[]> {
        return this.cosmosDBHelper.find(`SELECT * FROM c where c.partitionKey = 'widgets'`);
 
    }
}
