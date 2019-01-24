import { Observable } from 'rxjs';
import { BaseDataSource } from '@ngscaffolding/models';

export interface IDataSourceDataAccess {
    getDataSource(name: string|string[]): Observable<BaseDataSource>;
}