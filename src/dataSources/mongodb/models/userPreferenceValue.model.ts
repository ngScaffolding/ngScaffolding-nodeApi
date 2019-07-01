import { Document, Schema } from 'mongoose'
import { UserPreferenceValue } from '../../../models/src/index';

const mongoose = require('mongoose');

export interface IUserPreferenceValue extends UserPreferenceValue, Document {

}

const UserPreferenceValueSchema = new Schema({
    userId: String,
    definitionName: String,
    value: String, },
    { timestamps: true });

export let UserPreferenceValueModel = mongoose.model('UserPreferenceValue', UserPreferenceValueSchema);