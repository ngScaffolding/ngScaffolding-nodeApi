import { Router, Request, Response, NextFunction } from 'express';
import { DataSourceRequest, ActionRequestModel } from '../../models/index';
import { dataSourceResolver } from '../../dataSources/dataSource.resolver';
import { DataSourceHelper } from '../../utils/dataSource.helper';
import { RESTApiHandler } from '../../utils/restApi.dataSource';

const request = require('request');
const winston = require('../../config/winston');

var DataSourceSwitch = require('../../dataSourceSwitch');

export class ActionRouter {
  router: Router;
  constructor() {
    this.router = Router();
    this.init();
  }

  public postAction(req: Request, res: Response, next: NextFunction) {
    var actionRequest = req.body as ActionRequestModel;

    let dataRequest: DataSourceRequest = {
      name: actionRequest.action.dataSourceName,
      inputData: actionRequest.inputDetails,
      rowData: actionRequest.rows
    };

    let capRes = res;

    dataSourceResolver
      .resolve(dataRequest, req)
      .then(dataResults => {
        capRes.json(dataResults);
      })
      .catch(err => {
        winston.error(err);
        capRes.status(500).send('Call failed');
      });

    // var inputAndRows = DataSourceHelper.prepareInputAndRows(actionRequest.inputDetails, actionRequest.rows);

    // switch (actionRequest.action.type.toLowerCase()) {
    //   case 'restapi': {
    //     RESTApiHandler.runCommand(actionRequest.action.dataSourceName, inputAndRows.inputDetails, inputAndRows.rows, inputAndRows.inputDetails).then(
    //       dataResults => {
    //         res.json({ success: true });
    //       },
    //       err => {}
    //     );

    //     break;
    //   }
    // }

  }

  init() {
    this.router.post('/', this.postAction);
  }
}

const actionRouter = new ActionRouter().router;

export default actionRouter;
