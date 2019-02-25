import { IDataSourceSwitch } from '../dataSourceSwitch';
import { BaseDataSource, RestApiDataSource, DataSourceTypes, SystemDataSourceNames } from '@ngscaffolding/models';

var DataSourceSwitch = require('../dataSourceSwitch');

export function setupDataSource() {
  const ds: IDataSourceSwitch = DataSourceSwitch.default;

  //////////////////////////////////
  // users
  ds.dataSource.saveDataSource({
    name: SystemDataSourceNames.USERS_SELECT,
    isAudit: true,
    type: DataSourceTypes.RestApi,
    itemDetails: <RestApiDataSource>{
      verb: 'get',
      url: '/api/v1/users',
      serverName: 'OAUTH'
    }
  });

  //////////////////////////////////
  // roles
  ds.dataSource.saveDataSource({
    name: SystemDataSourceNames.ROLES_SELECT,
    isAudit: true,
    type: DataSourceTypes.RestApi,
    itemDetails: <RestApiDataSource>{
      verb: 'get',
      url: '/api/v1/roles',
      serverName: 'OAUTH'
    }
  });
}
