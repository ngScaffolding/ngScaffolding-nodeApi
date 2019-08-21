import { Document, Schema } from 'mongoose'
import { Role } from '../../../models/index';

const mongoose = require('mongoose');

export interface IRole extends Role, Document {
}

const RoleSchema = new Schema({
    description: String,
    adminRole: String
},
{ timestamps: true });

export let RoleModel = mongoose.model('Role', RoleSchema);
