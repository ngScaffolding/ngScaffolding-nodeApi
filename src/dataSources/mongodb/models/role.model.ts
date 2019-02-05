import { Document, Schema } from 'mongoose'
import { Role } from '@ngscaffolding/models';

const mongoose = require('mongoose');

export interface IRole extends Role, Document {
}

const RoleSchema = new Schema({
    description: String,
    adminRole: String
},
{ timestamps: true });

export let RoleModel = mongoose.model('Role', RoleSchema);
