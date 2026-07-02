import React from 'react';

const SpecItem = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="mb-4">
      <p className="text-xs text-slate-500 mb-1 font-medium">{label}</p>
      <p className="text-sm text-slate-900 font-semibold">{value}</p>
    </div>
  );
};

export default function Specifications({ specs }) {
  if (!specs) return null;

  return (
    <div className="mt-8 glass rounded-2xl p-6">
      <h2 className="text-xl font-bold text-slate-900 mb-6">Specifications</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        
        {/* Key Features */}
        {specs.keyFeatures && Object.keys(specs.keyFeatures).length > 0 && (
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Key Features</h3>
            <div className="grid grid-cols-2 gap-x-8">
              <SpecItem label="Displacement" value={specs.keyFeatures.displacement} />
              <SpecItem label="Max power" value={specs.keyFeatures.maxPower} />
              <SpecItem label="Torque power" value={specs.keyFeatures.torquePower} />
              <SpecItem label="Fuel delivery system" value={specs.keyFeatures.fuelDeliverySystem} />
              <SpecItem label="Braking System" value={specs.keyFeatures.brakingSystem} />
              <SpecItem label="Fuel tank capacity" value={specs.keyFeatures.fuelTankCapacity} />
            </div>
          </div>
        )}

        {/* Engine & Performance */}
        {specs.enginePerformance && Object.keys(specs.enginePerformance).length > 0 && (
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-sm font-bold text-slate-800 mb-4 mt-4 uppercase tracking-wider">Engine & Performance</h3>
            <div className="grid grid-cols-2 gap-x-8">
              <SpecItem label="Displacement" value={specs.enginePerformance.displacement} />
              <SpecItem label="Max power" value={specs.enginePerformance.maxPower} />
              <SpecItem label="Torque power" value={specs.enginePerformance.torquePower} />
              <SpecItem label="Torque RPM" value={specs.enginePerformance.torqueRpm} />
              <SpecItem label="Transmission" value={specs.enginePerformance.transmission} />
              <SpecItem label="Transmission type" value={specs.enginePerformance.transmissionType} />
              <SpecItem label="Gear shifting pattern" value={specs.enginePerformance.gearShiftingPattern} />
              <SpecItem label="Cylinders" value={specs.enginePerformance.cylinders} />
              <SpecItem label="Ignition system" value={specs.enginePerformance.ignitionSystem} />
              <SpecItem label="Cooling system" value={specs.enginePerformance.coolingSystem} />
              <SpecItem label="Clutch" value={specs.enginePerformance.clutch} />
              <SpecItem label="Fuel delivery system" value={specs.enginePerformance.fuelDeliverySystem} />
              <SpecItem label="Emission standard" value={specs.enginePerformance.emissionStandard} />
              <SpecItem label="Fuel type" value={specs.enginePerformance.fuelType} />
            </div>
          </div>
        )}

        {/* Brakes & Wheels */}
        {specs.brakesWheels && Object.keys(specs.brakesWheels).length > 0 && (
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-sm font-bold text-slate-800 mb-4 mt-4 uppercase tracking-wider">Brakes & Wheels</h3>
            <div className="grid grid-cols-2 gap-x-8">
              <SpecItem label="Braking System" value={specs.brakesWheels.brakingSystem} />
              <SpecItem label="Front Brake Type" value={specs.brakesWheels.frontBrakeType} />
              <SpecItem label="Rear Brake Type" value={specs.brakesWheels.rearBrakeType} />
              <SpecItem label="Wheel Type" value={specs.brakesWheels.wheelType} />
              <SpecItem label="Front Wheel Size" value={specs.brakesWheels.frontWheelSize} />
              <SpecItem label="Rear Wheel Size" value={specs.brakesWheels.rearWheelSize} />
              <SpecItem label="Tyre Type" value={specs.brakesWheels.tyreType} />
            </div>
          </div>
        )}

        {/* Chassis & Suspension */}
        {specs.chassisSuspension && Object.keys(specs.chassisSuspension).length > 0 && (
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-sm font-bold text-slate-800 mb-4 mt-4 uppercase tracking-wider">Chassis & Suspension</h3>
            <div className="grid grid-cols-2 gap-x-8">
              <SpecItem label="Front Suspension" value={specs.chassisSuspension.frontSuspension} />
              <SpecItem label="Rear Suspension" value={specs.chassisSuspension.rearSuspension} />
              <SpecItem label="Chassis Type" value={specs.chassisSuspension.chassisType} />
            </div>
          </div>
        )}

        {/* Dimensions */}
        {specs.dimensions && Object.keys(specs.dimensions).length > 0 && (
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-sm font-bold text-slate-800 mb-4 mt-4 uppercase tracking-wider">Dimensions</h3>
            <div className="grid grid-cols-2 gap-x-8">
              <SpecItem label="Weight" value={specs.dimensions.weight} />
              <SpecItem label="Seat Height" value={specs.dimensions.seatHeight} />
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}
