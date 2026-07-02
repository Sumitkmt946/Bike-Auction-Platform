const mongoose = require('mongoose');
require('dotenv').config();
const Bike = require('./models/Bike');

const specsData = {
  'Yamaha': {
    keyFeatures: { displacement: '998 cc', maxPower: '200 PS @ 13500 rpm', torquePower: '112.4 Nm @ 11500 rpm', fuelDeliverySystem: 'Fuel Injection', brakingSystem: 'Dual Channel ABS', fuelTankCapacity: '17 litres' },
    enginePerformance: { displacement: '998 cc', maxPower: '200 PS @ 13500 rpm', torquePower: '112.4 Nm @ 11500 rpm', torqueRpm: '11500 rpm', transmission: '6 Speed Manual', transmissionType: 'Chain Drive', gearShiftingPattern: '1 Down 5 Up', cylinders: '4', ignitionSystem: 'TCI', coolingSystem: 'Liquid Cooled', clutch: 'Wet Multiplate', fuelDeliverySystem: 'Fuel Injection', emissionStandard: 'BS6 Phase 2', fuelType: 'Petrol' },
    brakesWheels: { brakingSystem: 'Dual Channel ABS', frontBrakeType: 'Dual Disc', rearBrakeType: 'Disc', wheelType: 'Alloy', frontWheelSize: '17 inch', rearWheelSize: '17 inch', tyreType: 'Tubeless' },
    chassisSuspension: { frontSuspension: 'Telescopic fork', rearSuspension: 'Swingarm', chassisType: 'Aluminium Deltabox' },
    dimensions: { weight: '201 kg', seatHeight: '855 mm' }
  },
  'Ducati': {
    keyFeatures: { displacement: '1103 cc', maxPower: '215.5 PS @ 13000 rpm', torquePower: '123.6 Nm @ 9500 rpm', fuelDeliverySystem: 'Fuel Injection', brakingSystem: 'Cornering ABS', fuelTankCapacity: '17 litres' },
    enginePerformance: { displacement: '1103 cc', maxPower: '215.5 PS @ 13000 rpm', torquePower: '123.6 Nm @ 9500 rpm', torqueRpm: '9500 rpm', transmission: '6 Speed Manual', transmissionType: 'Chain Drive', gearShiftingPattern: '1 Down 5 Up', cylinders: '4', ignitionSystem: 'Digital', coolingSystem: 'Liquid Cooled', clutch: 'Hydraulically controlled slipper', fuelDeliverySystem: 'Fuel Injection', emissionStandard: 'BS6 Phase 2', fuelType: 'Petrol' },
    brakesWheels: { brakingSystem: 'Cornering ABS', frontBrakeType: 'Dual Disc', rearBrakeType: 'Disc', wheelType: 'Forged Alloy', frontWheelSize: '17 inch', rearWheelSize: '17 inch', tyreType: 'Tubeless' },
    chassisSuspension: { frontSuspension: 'Öhlins fully adjustable fork', rearSuspension: 'Öhlins fully adjustable shock', chassisType: 'Aluminum alloy "Front Frame"' },
    dimensions: { weight: '195.5 kg', seatHeight: '850 mm' }
  },
  'Honda': {
    keyFeatures: { displacement: '1000 cc', maxPower: '217.5 PS @ 14500 rpm', torquePower: '113 Nm @ 12500 rpm', fuelDeliverySystem: 'PGM-FI', brakingSystem: 'Dual Channel ABS', fuelTankCapacity: '16.1 litres' },
    enginePerformance: { displacement: '1000 cc', maxPower: '217.5 PS @ 14500 rpm', torquePower: '113 Nm @ 12500 rpm', torqueRpm: '12500 rpm', transmission: '6 Speed Manual', transmissionType: 'Chain Drive', gearShiftingPattern: '1 Down 5 Up', cylinders: '4', ignitionSystem: 'Digital', coolingSystem: 'Liquid Cooled', clutch: 'Wet Multiplate', fuelDeliverySystem: 'PGM-FI', emissionStandard: 'BS6 Phase 2', fuelType: 'Petrol' },
    brakesWheels: { brakingSystem: 'Dual Channel ABS', frontBrakeType: 'Dual Disc', rearBrakeType: 'Disc', wheelType: 'Alloy', frontWheelSize: '17 inch', rearWheelSize: '17 inch', tyreType: 'Tubeless' },
    chassisSuspension: { frontSuspension: 'Telescopic fork', rearSuspension: 'Pro-Link with gas-charged damper', chassisType: 'Aluminium Twin-Tube' },
    dimensions: { weight: '201 kg', seatHeight: '830 mm' }
  },
  'BMW': {
    keyFeatures: { displacement: '999 cc', maxPower: '210 PS @ 13750 rpm', torquePower: '113 Nm @ 11000 rpm', fuelDeliverySystem: 'Electronic Injection', brakingSystem: 'BMW Motorrad ABS Pro', fuelTankCapacity: '16.5 litres' },
    enginePerformance: { displacement: '999 cc', maxPower: '210 PS @ 13750 rpm', torquePower: '113 Nm @ 11000 rpm', torqueRpm: '11000 rpm', transmission: '6 Speed Manual', transmissionType: 'Chain Drive', gearShiftingPattern: '1 Down 5 Up', cylinders: '4', ignitionSystem: 'BMS-O', coolingSystem: 'Water/Oil Cooled', clutch: 'Multi-disc anti-hopping', fuelDeliverySystem: 'Electronic Injection', emissionStandard: 'BS6 Phase 2', fuelType: 'Petrol' },
    brakesWheels: { brakingSystem: 'BMW Motorrad ABS Pro', frontBrakeType: 'Dual Disc', rearBrakeType: 'Disc', wheelType: 'Cast Aluminium', frontWheelSize: '17 inch', rearWheelSize: '17 inch', tyreType: 'Tubeless' },
    chassisSuspension: { frontSuspension: 'Upside-down telescopic fork', rearSuspension: 'Aluminum swing arm', chassisType: 'Bridge-type frame, cast aluminium' },
    dimensions: { weight: '197 kg', seatHeight: '832 mm' }
  },
  'Kawasaki': {
    keyFeatures: { displacement: '998 cc', maxPower: '203 PS @ 13200 rpm', torquePower: '114.9 Nm @ 11400 rpm', fuelDeliverySystem: 'DFI', brakingSystem: 'KIBS ABS', fuelTankCapacity: '17 litres' },
    enginePerformance: { displacement: '998 cc', maxPower: '203 PS @ 13200 rpm', torquePower: '114.9 Nm @ 11400 rpm', torqueRpm: '11400 rpm', transmission: '6 Speed Manual', transmissionType: 'Chain Drive', gearShiftingPattern: '1 Down 5 Up', cylinders: '4', ignitionSystem: 'TCBI', coolingSystem: 'Liquid Cooled', clutch: 'Wet Multiplate', fuelDeliverySystem: 'DFI', emissionStandard: 'BS6 Phase 2', fuelType: 'Petrol' },
    brakesWheels: { brakingSystem: 'KIBS ABS', frontBrakeType: 'Dual Disc', rearBrakeType: 'Disc', wheelType: 'Alloy', frontWheelSize: '17 inch', rearWheelSize: '17 inch', tyreType: 'Tubeless' },
    chassisSuspension: { frontSuspension: 'Showa BFF fork', rearSuspension: 'Showa BFRC shock', chassisType: 'Aluminum Perimeter' },
    dimensions: { weight: '207 kg', seatHeight: '835 mm' }
  }
};

const seedSpecs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    
    const bikes = await Bike.find();
    for (const bike of bikes) {
      if (specsData[bike.brand]) {
        bike.specifications = specsData[bike.brand];
        await bike.save();
        console.log(`Updated specs for ${bike.brand} ${bike.model}`);
      }
    }
    
    console.log('Finished seeding specs');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedSpecs();
