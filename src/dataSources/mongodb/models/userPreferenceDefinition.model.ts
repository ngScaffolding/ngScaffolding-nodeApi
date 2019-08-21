import { Document, Schema } from 'mongoose'
import { UserPreferenceDefinition } from '../../../models/index';

const mongoose = require('mongoose');

export interface IUserPreferenceDefinition extends UserPreferenceDefinition, Document {

}

const UserPreferenceDefinitionSchema = new Schema({
    inputDetails: {},
    name: String,
    roles: [String]
    }, 
    { timestamps: true });

export let UserPreferenceDefinitionModel = mongoose.model('UserPreferenceDefinition', UserPreferenceDefinitionSchema);