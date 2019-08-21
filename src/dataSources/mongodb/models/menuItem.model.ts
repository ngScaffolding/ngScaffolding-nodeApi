import {Document, Schema} from 'mongoose'
import { CoreMenuItem } from '../../../models/index';

const mongoose = require('mongoose');

export interface IMenuItem extends CoreMenuItem, Document {
}

const MenuItemSchema = new Schema({
    name: String,
    parent: String,
    type: String,
    title: String,
    icon: String,
    color: String,
    columnButton: Boolean,
    selectionRequired: Boolean,
    flushReferenceValues: String,
    multipleTarget: Boolean,
    confirmationMessage: String,
    idField: String,
    idValue: String,
    entityType: String,
    additionalProperties: String,
    //inputBuilderDefinition: InputBuilderDefinition,
    refresh: Boolean,
    isAudit: Boolean,
    success: String,
    error: String,
    dataSourceName: String,
    controller: String,
    templateUrl: String,
    url: String,
    target: String,
    items: [{}],
    roles: [String],
    menuDetails: {}
},
{ timestamps: true });

export let MenuItemModel = mongoose.model('MenuItem', MenuItemSchema);