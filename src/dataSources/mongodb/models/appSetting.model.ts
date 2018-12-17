import { Document, Schema } from 'mongoose'
import { AppSettingsValue } from '@ngscaffolding/models';

const mongoose = require('mongoose');

export interface IError extends AppSettingsValue, Document {
}

const AppSettingSchema = new Schema({
    name: String,
    value: String
},
{ timestamps: true });

export let AppSettingModel = mongoose.model('AppSetting', AppSettingSchema);
