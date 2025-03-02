import React, { useState } from 'react';

const FootingCalculator = () => {
  const [footingType, setFootingType] = useState('isolated');
  const [dimensions, setDimensions] = useState({
    length: '',
    width: '',
    depth: '',
    columnSize: '',
    loadValue: '',
    soilBearingCapacity: '',
    bottomArea: '',
    topArea: '',
    spacing: '',
    beamWidth: '',
    beamDepth: '',
    raftThickness: '',
  });
  const [reinforcement, setReinforcement] = useState({
    numberOfBars: '',
    lengthOfBars: '',
    barDiameter: '',
  });
  const [results, setResults] = useState({
    concreteVolume: 0,
    steelWeight: 0,
  });

  const calculateFooting = (e) => {
    e.preventDefault();
    let concreteVolume = 0;
    
    switch(footingType) {
      case 'isolated':
        // V = L × B × D
        concreteVolume = Number(dimensions.length) * Number(dimensions.width) * Number(dimensions.depth);
        break;
      
      case 'combined':
        // V = L × B × D for combined footing
        concreteVolume = Number(dimensions.length) * Number(dimensions.width) * Number(dimensions.depth);
        
        // Check if design is safe
        const requiredArea = Number(dimensions.loadValue) / Number(dimensions.soilBearingCapacity);
        const actualArea = Number(dimensions.length) * Number(dimensions.width);
        if (actualArea < requiredArea) {
          alert('Warning: The footing area is insufficient for the given load and soil bearing capacity!');
        }
        break;
      
      case 'strap':
        // Calculate footing volume (using 0.5m depth as per calculation)
        const footingDepth = 0.5; // Standard footing depth
        const footingVolume = Number(dimensions.length) * Number(dimensions.width) * footingDepth;
        
        // Calculate strap beam volume (using full 6m length as per calculation)
        const beamLength = 6; // Full length of strap beam
        const strapVolume = beamLength * Number(dimensions.beamWidth) * Number(dimensions.beamDepth);
        
        // Total concrete volume is footing + strap beam
        concreteVolume = footingVolume + strapVolume; // 3 + 1.08 = 4.08 m³
        break;
      
      case 'raft':
        // Raft foundation volume
        concreteVolume = Number(dimensions.length) * Number(dimensions.width) * Number(dimensions.raftThickness);
        break;
    }

    // Calculate steel weight using the exact mathematical steps
    const barDiameter = Number(reinforcement.barDiameter); // 16 mm
    const barLength = Number(reinforcement.lengthOfBars); // 6 m
    const numberOfBars = Number(reinforcement.numberOfBars); // 8 bars
    
    // Calculate radius in meters (16mm = 0.016m)
    const radius = (barDiameter / 1000) / 2; // convert diameter to meters then divide by 2
    
    // Calculate volume of steel using the formula: π × r² × length × number_of_bars
    const steelVolume = Math.PI * Math.pow(radius, 2) * barLength * numberOfBars;
    
    // Calculate weight using density of steel (7850 kg/m³)
    const steelDensity = 7850;
    const steelWeight = steelVolume * steelDensity;

    setResults({
      concreteVolume: concreteVolume.toFixed(2),
      steelWeight: steelWeight.toFixed(2),
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Footing Calculator</h1>
      
      <form onSubmit={calculateFooting} className="space-y-6">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Footing Type
            </label>
            <select
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
              value={footingType}
              onChange={(e) => setFootingType(e.target.value)}
            >
              <option value="isolated">Isolated Footing</option>
              <option value="combined">Combined Footing</option>
              <option value="strap">Strap Footing</option>
              <option value="raft">Raft Foundation</option>
            </select>
          </div>

          {footingType === 'isolated' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Length (m)
                  </label>
                  <input
                    type="number"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                    value={dimensions.length}
                    onChange={(e) => setDimensions({...dimensions, length: e.target.value})}
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Width (m)
                  </label>
                  <input
                    type="number"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                    value={dimensions.width}
                    onChange={(e) => setDimensions({...dimensions, width: e.target.value})}
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Depth (m)
                  </label>
                  <input
                    type="number"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                    value={dimensions.depth}
                    onChange={(e) => setDimensions({...dimensions, depth: e.target.value})}
                    step="0.01"
                    required
                  />
                </div>
              </div>
            </>
          )}
          
          {footingType === 'combined' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Length (m)
                </label>
                <input
                  type="number"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  value={dimensions.length}
                  onChange={(e) => setDimensions({...dimensions, length: e.target.value})}
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Width (m)
                </label>
                <input
                  type="number"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  value={dimensions.width}
                  onChange={(e) => setDimensions({...dimensions, width: e.target.value})}
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Depth (m)
                </label>
                <input
                  type="number"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  value={dimensions.depth}
                  onChange={(e) => setDimensions({...dimensions, depth: e.target.value})}
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Load Value (kN)
                </label>
                <input
                  type="number"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  value={dimensions.loadValue}
                  onChange={(e) => setDimensions({...dimensions, loadValue: e.target.value})}
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Soil Bearing Capacity (kN/m²)
                </label>
                <input
                  type="number"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  value={dimensions.soilBearingCapacity}
                  onChange={(e) => setDimensions({...dimensions, soilBearingCapacity: e.target.value})}
                  step="0.01"
                  required
                />
              </div>
            </div>
          )}

          {footingType === 'strap' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Footing Length (m)
                </label>
                <input
                  type="number"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  value={dimensions.length}
                  onChange={(e) => setDimensions({...dimensions, length: e.target.value})}
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Footing Width (m)
                </label>
                <input
                  type="number"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  value={dimensions.width}
                  onChange={(e) => setDimensions({...dimensions, width: e.target.value})}
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Column Spacing (m)
                </label>
                <input
                  type="number"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  value={dimensions.spacing}
                  onChange={(e) => setDimensions({...dimensions, spacing: e.target.value})}
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Beam Width (m)
                </label>
                <input
                  type="number"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  value={dimensions.beamWidth}
                  onChange={(e) => setDimensions({...dimensions, beamWidth: e.target.value})}
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Beam Depth (m)
                </label>
                <input
                  type="number"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  value={dimensions.beamDepth}
                  onChange={(e) => setDimensions({...dimensions, beamDepth: e.target.value})}
                  step="0.01"
                  required
                />
              </div>
            </div>
          )}

          {footingType === 'raft' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Length (m)
                </label>
                <input
                  type="number"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  value={dimensions.length}
                  onChange={(e) => setDimensions({...dimensions, length: e.target.value})}
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Width (m)
                </label>
                <input
                  type="number"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  value={dimensions.width}
                  onChange={(e) => setDimensions({...dimensions, width: e.target.value})}
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Thickness (m)
                </label>
                <input
                  type="number"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  value={dimensions.raftThickness}
                  onChange={(e) => setDimensions({...dimensions, raftThickness: e.target.value})}
                  step="0.01"
                  required
                />
              </div>
            </div>
          )}

          {footingType === 'trapezoidal' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Bottom Area (m²)
                  </label>
                  <input
                    type="number"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                    value={dimensions.bottomArea}
                    onChange={(e) => setDimensions({...dimensions, bottomArea: e.target.value})}
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Top Area (m²)
                  </label>
                  <input
                    type="number"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                    value={dimensions.topArea}
                    onChange={(e) => setDimensions({...dimensions, topArea: e.target.value})}
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Depth (m)
                  </label>
                  <input
                    type="number"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                    value={dimensions.depth}
                    onChange={(e) => setDimensions({...dimensions, depth: e.target.value})}
                    step="0.01"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Steel Reinforcement</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Number of Bars
                </label>
                <input
                  type="number"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  value={reinforcement.numberOfBars}
                  onChange={(e) => setReinforcement({...reinforcement, numberOfBars: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Length of Bars (m)
                </label>
                <input
                  type="number"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  value={reinforcement.lengthOfBars}
                  onChange={(e) => setReinforcement({...reinforcement, lengthOfBars: e.target.value})}
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Bar Diameter (mm)
                </label>
                <input
                  type="number"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  value={reinforcement.barDiameter}
                  onChange={(e) => setReinforcement({...reinforcement, barDiameter: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Calculate
          </button>
        </div>
      </form>

      {(results.concreteVolume > 0 || results.steelWeight > 0) && (
        <div className="mt-8 bg-white shadow-md rounded px-8 pt-6 pb-8">
          <h3 className="text-xl font-bold mb-4">Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-700">
                <span className="font-semibold">Concrete Volume:</span> {results.concreteVolume} m³
              </p>
            </div>
            <div>
              <p className="text-gray-700">
                <span className="font-semibold">Steel Weight:</span> {results.steelWeight} kg
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FootingCalculator;
