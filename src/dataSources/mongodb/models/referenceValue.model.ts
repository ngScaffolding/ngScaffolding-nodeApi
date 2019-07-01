import { Document, Schema } from 'mongoose';
import { ReferenceValue } from '../../../models/src/index';

const mongoose = require('mongoose');

export interface IReferenceValue extends ReferenceValue, Document {}

const ReferenceValueItemSchema = new Schema({
  display: String,
  value: String,
  subtitle: String,
  subtitle2: String,
  itemOrder: Number
});

const ReferenceValueSchema = new Schema(
  {
    name: String,
    groupName: String,
    //type: String,
    value: String,
    dataSourceName: String,
    cacheSeconds: Number,
    roles: [String],
    inputDetails: String,
    referenceValueItems: [ReferenceValueItemSchema],

    // Used to populate from dataSource
    displayProperty: String,
    valueProperty: String,
    itemOrderProperty: String,
    subtitleProperty: String
  },
  { timestamps: true }
);

export let ReferenceValueModel = mongoose.model(
  'ReferenceValue',
  ReferenceValueSchema
);
