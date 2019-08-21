import { BaseDataSource } from '../../models/index';

export interface IDataSourceDataAccess {
    getDataSource(name: string|string[]): Promise<BaseDataSource>;
    saveDataSource(dataSource: BaseDataSource): Promise<BaseDataSource>;
}