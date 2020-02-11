import { Request } from 'express';
import { DataSourceRequest } from '../models';

const IncomingForm = require('formidable').IncomingForm;

export interface ExtractedFormData {
    dataSourceRequest?: DataSourceRequest;
    files?: File[];
}

export async function extractFormData(req: Request): Promise<ExtractedFormData> {
    return new Promise((resolve, reject) => {
        const retVal: ExtractedFormData = {};
        
        var form = new IncomingForm();

        form.parse(req, (err, fields, files) => {
            retVal.dataSourceRequest = JSON.parse(fields['dataSourceRequest']);

            resolve(retVal);
        });
    });

}
