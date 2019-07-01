import { Document, Schema } from 'mongoose'
import { BaseDataSource } from '../../../models/src/index';

const mongoose = require('mongoose');

export interface IDataSource extends BaseDataSource, Document {
}

const DataSourceSchema = new Schema({
    name: String,
    type: String,
    
    expires: Number,
    timeout: Number,

    isPagedData: Boolean,
    isAudit: Boolean,

    flushReferenceValues: String,

    itemDetails: {},
    parameters: [{}],
    inputControls: [{}],

    roles: [String]
},
{ timestamps: true });

export let DataSourceModel = mongoose.model('DataSource', DataSourceSchema);