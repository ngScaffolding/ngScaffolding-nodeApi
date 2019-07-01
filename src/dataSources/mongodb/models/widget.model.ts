import { Document, Schema } from 'mongoose'
import { WidgetModelBase } from '../../../models/src/index';

const mongoose = require('mongoose');

export interface IWidget extends WidgetModelBase, Document {
}

const WidgetSchema = new Schema({
    name: String,
    galleryName: String,
    inputDetails: Object,
    itemDetails: Object,
    title: String,
    refreshInterval: Number
},
{ timestamps: true });

export let WidgetModel = mongoose.model('Widget', WidgetSchema);