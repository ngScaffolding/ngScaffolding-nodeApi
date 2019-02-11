import {Document, Schema} from 'mongoose'
import { BaseDataSource } from '@ngscaffolding/models';

const mongoose = require('mongoose');

export interface IDataSource extends BaseDataSource, Document {
}

const DataSourceSchema = new Schema({
    name: String,
    type: String,

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