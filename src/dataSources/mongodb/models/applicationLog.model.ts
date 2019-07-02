import {Document, Schema} from 'mongoose'
import { ApplicationLog } from '../../../models/src/index';

const mongoose = require('mongoose');

export interface IApplicationLog extends ApplicationLog, Document {

}

const ApplicationLogSchema = new Schema({
    userID: String,
    logType: String,
    description: String,
    endPoint: String,
    httpCommand: String,
    values: String,
    createdOn: { type: Date, default: Date.now  }
});

export let ApplicationLogModel = mongoose.model('ApplicationLog', ApplicationLogSchema);