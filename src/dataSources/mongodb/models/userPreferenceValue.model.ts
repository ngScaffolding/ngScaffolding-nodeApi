import { Document, Schema } from 'mongoose'
import { UserPreferenceValue } from '../../../models/index';

const mongoose = require('mongoose');

export interface IUserPreferenceValue extends UserPreferenceValue, Document {

}

const UserPreferenceValueSchema = new Schema({
    userId: String,
    name: String,
    value: String, },
    { timestamps: true });

export let UserPreferenceValueModel = mongoose.model('UserPreferenceValue', UserPreferenceValueSchema);