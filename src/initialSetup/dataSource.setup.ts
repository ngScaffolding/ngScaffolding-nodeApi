import { IDataSourceSwitch } from "../dataSourceSwitch";
import { BaseDataSource, RestApiDataSource, DataSourceTypes } from "@ngscaffolding/models";

var DataSourceSwitch = require('../dataSourceSwitch');

export function setupDataSource(){
    const ds: IDataSourceSwitch = DataSourceSwitch.default;

    var userList: BaseDataSource ={
        name: 'users.Select',
        isAudit: true,
        type: DataSourceTypes.RestApi,
        itemDetails: <RestApiDataSource>{
            verb: 'get',
            url: '/api/v1/user',
            serverName: 'OAUTH'
        }
    };
    ds.dataSource.saveDataSource(userList);
}