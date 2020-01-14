import { Router, Request, Response, NextFunction } from 'express';
import { DataSourceRequest } from '../../models/index';
import { DataSourceResolver } from '../../dataSources/dataSource.resolver';

const winston = require('../../config/winston');

export class DataSourceRouter {
    router: Router;
    constructor() {
        this.router = Router();
        this.init();
    }

    public async postDataSource(req: Request, res: Response) {
        let dataRequest = req.body as DataSourceRequest;

        let capRes = res;

        let dataResults = await DataSourceResolver.resolve(dataRequest, req).catch(err => {
            winston.error(err);
            capRes.status(500).send('Call failed');
            return;
        });
        capRes.json(dataResults);
    }

    init() {
        this.router.post('/', this.postDataSource);
    }
}

const dataSourceRouter = new DataSourceRouter().router;

export default dataSourceRouter;
