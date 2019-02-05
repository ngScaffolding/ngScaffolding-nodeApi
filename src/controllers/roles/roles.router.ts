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

import { IDataAccessLayer } from '../../dataSources/dataAccessLayer';

const request = require('request');

var DataSourceSwitch = require('../../dataSourceSwitch');

export class UserRouter {
  router: Router;
  constructor() {
    this.router = Router();
    this.init();
  }

    public createUser(req: Request, res: Response, next: NextFunction) { }
    public registerUser(req: Request, res: Response, next: NextFunction) { }
    public confirmEmail(req: Request, res: Response, next: NextFunction) { }
    public updateUser(req: Request, res: Response, next: NextFunction) { }
    public setPassword(req: Request, res: Response, next: NextFunction) { }

  public getUsers(req: Request, res: Response, next: NextFunction) {
    const ds: IDataSourceSwitch = DataSourceSwitch.default;
    let capRes: any = res;

    var dataAccess = DataSourceSwitch.default.dataSource as IDataAccessLayer;

    // dataAccess.getAppSettingsValues().then(defValues => {
    //   capRes.json(defValues);
    // });
  }
  
  init() {
      this.router.get('/', this.getUsers);
      this.router.post('/create', this.createUser);
      this.router.post('/register', this.createUser);
      this.router.post('/confirm', this.confirmEmail);
      this.router.post('/setpassword', this.setPassword);
      this.router.post('/update', this.updateUser);
    }
}

const userRouter = new UserRouter().router;

export default userRouter;
