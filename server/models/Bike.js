const mongoose = require('mongoose');

/**
 * Bike Schema
 * Represents a motorcycle listing available for auction.
 */
const bikeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Bike name is required'],
    trim: true,
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true,
  },
  model: {
    type: String,
    required: [true, 'Model is required'],
    trim: true,
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  startingPrice: {
    type: Number,
    required: [true, 'Starting price is required'],
    min: [0, 'Starting price cannot be negative'],
  },
  images: {
    type: [String],
    default: [],
  },
  specifications: {
    keyFeatures: {
      displacement: String,
      maxPower: String,
      torquePower: String,
      fuelDeliverySystem: String,
      brakingSystem: String,
      fuelTankCapacity: String,
    },
    enginePerformance: {
      displacement: String,
      maxPower: String,
      torquePower: String,
      torqueRpm: String,
      transmission: String,
      transmissionType: String,
      gearShiftingPattern: String,
      cylinders: String,
      ignitionSystem: String,
      coolingSystem: String,
      clutch: String,
      fuelDeliverySystem: String,
      emissionStandard: String,
      fuelType: String,
    },
    brakesWheels: {
      brakingSystem: String,
      frontBrakeType: String,
      rearBrakeType: String,
      wheelType: String,
      frontWheelSize: String,
      rearWheelSize: String,
      tyreType: String,
    },
    chassisSuspension: {
      frontSuspension: String,
      rearSuspension: String,
      chassisType: String,
    },
    dimensions: {
      weight: String,
      seatHeight: String,
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Bike', bikeSchema);
