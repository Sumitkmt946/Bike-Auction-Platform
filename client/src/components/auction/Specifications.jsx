import React, { useState } from 'react';
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';

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
  const [isExpanded, setIsExpanded] = useState(false);

  if (!specs) return null;

  return (
    <div className="mt-8 glass rounded-2xl p-6 border border-slate-200">
      <h2 className="text-xl font-bold text-slate-900 mb-6">Specifications</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        
        {/* Key Features (Always visible) */}
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

        {/* Hidden Sections */}
        {isExpanded && (
          <>
            {/* Engine & Performance */}
            {specs.enginePerformance && Object.keys(specs.enginePerformance).length > 0 && (
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-sm font-bold text-slate-800 mb-4 mt-4 uppercase tracking-wider border-t border-slate-100 pt-6">Engine & Performance</h3>
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
                <h3 className="text-sm font-bold text-slate-800 mb-4 mt-4 uppercase tracking-wider border-t border-slate-100 pt-6">Brakes & Wheels</h3>
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
                <h3 className="text-sm font-bold text-slate-800 mb-4 mt-4 uppercase tracking-wider border-t border-slate-100 pt-6">Chassis & Suspension</h3>
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
                <h3 className="text-sm font-bold text-slate-800 mb-4 mt-4 uppercase tracking-wider border-t border-slate-100 pt-6">Dimensions</h3>
                <div className="grid grid-cols-2 gap-x-8">
                  <SpecItem label="Weight" value={specs.dimensions.weight} />
                  <SpecItem label="Seat Height" value={specs.dimensions.seatHeight} />
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Toggle Button */}
      <div className="mt-6 border-t border-slate-100 pt-4 flex justify-center">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-accent-600 font-semibold hover:text-accent-700 transition-colors"
        >
          {isExpanded ? (
            <>
              View Less <RiArrowUpSLine className="text-xl" />
            </>
          ) : (
            <>
              View More <RiArrowDownSLine className="text-xl" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
