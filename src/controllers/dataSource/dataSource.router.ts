import { Router, Request, Response, NextFunction } from 'express';
import { DataSourceRequest } from '../../models/index';
import { DataSourceResolver } from '../../dataSources/dataSource.resolver';

const IncomingForm = require('formidable').IncomingForm;

const winston = require('../../config/winston');

export class DataSourceRouter {
    router: Router;
    constructor() {
        this.router = Router();
        this.init();
    }

    public async postDataSource(req: Request, res: Response) {
        var form = new IncomingForm();
        var dataRequest: DataSourceRequest;

        form.parse(req, (err, fields, files) => {
            let dataRequest = JSON.parse(fields['dataSourceRequest']);

            let capRes = res;

            let dataResults = DataSourceResolver.resolve(dataRequest, req)
                .then(dataResults => {
                    capRes.json(dataResults);
                })
                .catch(err => {
                    winston.error(err);
                    capRes.status(500).send('Call failed');
                    return;
                });
        });
    }

    init() {
        this.router.post('/', this.postDataSource);
    }
}

const dataSourceRouter = new DataSourceRouter().router;

export default dataSourceRouter;
