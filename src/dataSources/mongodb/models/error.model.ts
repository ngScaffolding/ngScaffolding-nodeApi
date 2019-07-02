import { Document, Schema } from 'mongoose'
import { ErrorModel } from '../../../models/src/index';

const mongoose = require('mongoose');

export interface IError extends ErrorModel, Document {
}

const ErrorSchema = new Schema({
    source: String,
    message: String,

    stackTrace: String,

},
{ timestamps: true });

export let ErrorLogModel = mongoose.model('Error', ErrorSchema);
