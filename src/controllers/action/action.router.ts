import { Router, Request, Response, NextFunction } from 'express';
import { IDataSourceSwitch } from '../../dataSourceSwitch';
import {
  DataSourceRequest,
  BaseDataSource,
  RestApiDataSource,
  DataResults,
  ActionResultModel,
  ActionRequestModel
} from '@ngscaffolding/models';
import { DataSourceHelper } from '../../utils/dataSource.helper';
import { RESTApiHandler } from '../../utils/restApi.dataSource';

const request = require('request');

var DataSourceSwitch = require('../../dataSourceSwitch');

export class ActionRouter {
  router: Router;
  constructor() {
    this.router = Router();
    this.init();
  }

  public postAction(req: Request, res: Response, next: NextFunction) {
    const ds: IDataSourceSwitch = DataSourceSwitch.default;

    var actionRequest = req.body as ActionRequestModel;

    var inputAndRows = DataSourceHelper.prepareInputAndRows(actionRequest.inputDetails, actionRequest.rows);
    
    switch(actionRequest.action.type.toLowerCase()){

        case 'restapi': {
            RESTApiHandler.runCommand(actionRequest.action.dataSourceName, inputAndRows.inputDetails, inputAndRows.rows).then(
                dataResults =>{ 
                  res.json({success: true });
                },
                err => {}
            )

            break;
        }
    }

    let capRes = res;
  }

  init() {
    this.router.post('/', this.postAction);
  }
}

const actionRouter = new ActionRouter().router;

export default actionRouter;
