import { IDataSourceSwitch } from "../dataSourceSwitch";
import { BaseDataSource, RestApiDataSource, DataSourceTypes, SystemDataSourceNames } from "@ngscaffolding/models";

var DataSourceSwitch = require('../dataSourceSwitch');

export function setupDataSource(){
    const ds: IDataSourceSwitch = DataSourceSwitch.default;

    var userList: BaseDataSource ={
        name: SystemDataSourceNames.USERS_SELECT,
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