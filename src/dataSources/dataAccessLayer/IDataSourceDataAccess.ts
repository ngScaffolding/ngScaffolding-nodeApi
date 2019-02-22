import { BaseDataSource } from '@ngscaffolding/models';

export interface IDataSourceDataAccess {
    getDataSource(name: string|string[]): Promise<BaseDataSource>;
    saveDataSource(dataSource: BaseDataSource): Promise<BaseDataSource>;
}