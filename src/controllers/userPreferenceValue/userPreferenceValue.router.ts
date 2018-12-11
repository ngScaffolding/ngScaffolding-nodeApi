import { Router, Request, Response, NextFunction } from 'express';
import { IDataSourceSwitch } from '../../dataSourceSwitch';
import {
  DataSourceRequest,
  BaseDataSource,
  RestApiDataSource,
  DataResults,
  ActionResultModel,
  UserPreferenceValue,
  BasicUser
} from '@ngscaffolding/models';
import { DataSourceHelper } from '../../utils/dataSource.helper';
import { RESTApiHandler } from '../../utils/restApi.dataSource';
import { IDataAccessLayer } from '../../dataSources/dataAccessLayer';

const request = require('request');

var DataSourceSwitch = require('../../dataSourceSwitch');

export class UserPreferenceValueRouter {
  router: Router;
  constructor() {
    this.router = Router();
    this.init();
  }

  public getValues(req: Request, res: Response, next: NextFunction) {
    const ds: IDataSourceSwitch = DataSourceSwitch.default;
    let capRes: any = res;
    let user = req['userDetails'] as BasicUser;

    var dataAccess = DataSourceSwitch.default.dataSource as IDataAccessLayer;

    dataAccess.getUserPreferenceValues(user.userId).subscribe(defValues => {
      capRes.json(defValues);
    });
  }
  
  public saveValue(req: Request, res: Response, next: NextFunction) {
    var userPreferenceValue = req.body as UserPreferenceValue;

  }


  init() {
    this.router.get('/', this.getValues);
    this.router.post('/', this.saveValue);
  }
}

const userPreferenceValueRouter = new UserPreferenceValueRouter().router;

export default userPreferenceValueRouter;
