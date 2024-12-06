// models/capacitySchema.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const capacitySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  totalHours: { type: Number, required: true },
  availableHours: { type: Number, required: true },
  allocatedHours: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Capacity', capacitySchema);
