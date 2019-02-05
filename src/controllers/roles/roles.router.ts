import { Router, Request, Response, NextFunction } from 'express';
import { IDataSourceSwitch } from '../../dataSourceSwitch';
import {
  DataSourceRequest,
  BaseDataSource,
  RestApiDataSource,
  DataResults,
  ActionResultModel,
  UserPreferenceValue,
  BasicUser,
  Role
} from '@ngscaffolding/models';

import { IDataAccessLayer } from '../../dataSources/dataAccessLayer';

const request = require('request');

var DataSourceSwitch = require('../../dataSourceSwitch');

export class RolesRouter {
  router: Router;
  constructor() {
    this.router = Router();
    this.init();
  }

  public getRoles(req: Request, res: Response, next: NextFunction) {
    const ds: IDataSourceSwitch = DataSourceSwitch.default;
    var userDetails = req['userDetails'] as BasicUser;
    const isAdmin = (userDetails.roles && userDetails.roles.some(role => role.toLowerCase() === "admin"));
    let capRes: any = res;

    var dataAccess = DataSourceSwitch.default.dataSource as IDataAccessLayer;

    ///
    /// Only return roles that the user is a member of
    const allRoles = dataAccess.getRoles().then(roles => {
      const userRoles: Role[] = [];
      roles.forEach(role => {
        if (isAdmin || (userDetails.roles && userDetails.roles.some(loopRole => loopRole.toLowerCase() === role.name.toLowerCase()))) {
          userRoles.push(role);
        }
      });

      res.json(userRoles);
    }).catch(err=>{
      res.sendStatus(500);
    });
  }

  init() {
    this.router.get('/', this.getRoles);
    // this.router.post('/', this.createUser);
    // this.router.patch('/', this.createUser);
    // this.router.delete('/', this.confirmEmail);
  }
}

const rolesRouter = new RolesRouter().router;

export default rolesRouter;
