import { Router, Request, Response, NextFunction } from 'express';
import { IDataSourceSwitch } from '../../dataSourceSwitch';
import { UserPreferenceValue, BasicUser } from '../../models/index';
import { IDataAccessLayer } from '../../dataSources/dataAccessLayer';
import isUserInRole from '../../auth/authoriseRoles';

var DataSourceSwitch = require('../../dataSourceSwitch');
const winston = require('../../config/winston');

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

    dataAccess
      .getUserPreferenceValues(user.userId)
      .then(defValues => {
        capRes.json(defValues);
      })
      .catch(err => {
        winston.error(err);
        capRes.sendStatus(500);
      });
  }

  public saveValue(req: Request, res: Response, next: NextFunction) {
    var userPreferenceValue = req.body as UserPreferenceValue;
    let capRes: any = res;

    let user = req['userDetails'] as BasicUser;
    userPreferenceValue.userId = user.userId;

    var dataAccess = DataSourceSwitch.default.dataSource as IDataAccessLayer;

    dataAccess
      .saveUserPreferenceValue(userPreferenceValue)
      .then(prefValues => {
        capRes.json(prefValues);
      })
      .catch(err => {
        winston.error(err);
        capRes.sendStatus(500);
      });
  }

  public deleteValue(req: Request, res: Response, next: NextFunction) {
    const name = req.params.name;
    let capRes: any = res;

    let user = req['userDetails'] as BasicUser;

    var dataAccess = DataSourceSwitch.default.dataSource as IDataAccessLayer;

    dataAccess
      .deleteUserPreferenceValue(user.userId, name)
      .then(prefValues => {
        capRes.json(prefValues);
      })
      .catch(err => {
        winston.error(err);
        capRes.sendStatus(500);
      });
  }

  public getAllProfiles(req: Request, res: Response, next: NextFunction) {
    var userPreferenceValue = req.body as UserPreferenceValue;
    let capRes: any = res;

    let user = req['userDetails'] as BasicUser;
    userPreferenceValue.userId = user.userId;

    var dataAccess = DataSourceSwitch.default.dataSource as IDataAccessLayer;

    dataAccess
      .getAllProfiles()
      .then(prefValues => {
        capRes.json(prefValues);
      })
      .catch(err => {
        winston.error(err);
        capRes.sendStatus(500);
      });
  }

  init() {
    this.router.get('/', this.getValues);
    this.router.post('/', this.saveValue);
    this.router.delete('/:name', this.deleteValue);

    // Get All (For Admin)
    this.router.post('/profiles', isUserInRole('admin'), this.getAllProfiles);
  }
}

const userPreferenceValueRouter = new UserPreferenceValueRouter().router;

export default userPreferenceValueRouter;
