import React, { useState } from 'react';

const SlabCalculator = () => {
  const [dimensions, setDimensions] = useState({
    length: '',
    width: '',
    thickness: '',
    mainBarSpacing: '',
    distributionBarSpacing: '',
    barDiameter: '',
  });

  const [results, setResults] = useState({
    concreteVolume: 0,
    steelWeight: 0,
    shutteringArea: 0,
  });

  const calculateSlab = (e) => {
    e.preventDefault();

    // Convert all inputs to numbers
    const length = Number(dimensions.length);
    const width = Number(dimensions.width);
    const thickness = Number(dimensions.thickness);
    const mainBarSpacing = Number(dimensions.mainBarSpacing) / 1000; // Convert mm to m
    const distributionBarSpacing = Number(dimensions.distributionBarSpacing) / 1000; // Convert mm to m
    const barDiameter = Number(dimensions.barDiameter);

    // 1. Calculate Concrete Volume
    const concreteVolume = length * width * thickness;

    // 2. Calculate Steel Weight
    // Main bars (Bottom Layer)
    const numMainBars = Math.floor(width / mainBarSpacing) + 1;
    const mainBarsLength = numMainBars * length;

    // Distribution bars (Top Layer)
    const numDistBars = Math.floor(length / distributionBarSpacing) + 1;
    const distBarsLength = numDistBars * width;

    // Total steel length
    const totalSteelLength = mainBarsLength + distBarsLength;

    // Steel weight calculation using the formula: (d²/162) × Total Length
    const steelWeight = (Math.pow(barDiameter, 2) / 162) * totalSteelLength;

    // 3. Calculate Shuttering Area
    const perimeter = 2 * (length + width);
    const shutteringArea = perimeter * thickness;

    // Set results with 2 decimal places
    setResults({
      concreteVolume: concreteVolume.toFixed(2),
      steelWeight: steelWeight.toFixed(2),
      shutteringArea: shutteringArea.toFixed(2),
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Slab Calculator</h1>
      
      <form onSubmit={calculateSlab} className="space-y-6">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Slab Dimensions */}
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
                value={dimensions.thickness}
                onChange={(e) => setDimensions({...dimensions, thickness: e.target.value})}
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Steel Reinforcement Details */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Steel Reinforcement Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Main Bar Spacing (mm)
                </label>
                <input
                  type="number"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  value={dimensions.mainBarSpacing}
                  onChange={(e) => setDimensions({...dimensions, mainBarSpacing: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Distribution Bar Spacing (mm)
                </label>
                <input
                  type="number"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  value={dimensions.distributionBarSpacing}
                  onChange={(e) => setDimensions({...dimensions, distributionBarSpacing: e.target.value})}
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
                  value={dimensions.barDiameter}
                  onChange={(e) => setDimensions({...dimensions, barDiameter: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Calculate
          </button>
        </div>

        {/* Results */}
        {(results.concreteVolume > 0 || results.steelWeight > 0) && (
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-lg font-semibold mb-4">Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-gray-700 font-semibold">Concrete Volume:</p>
                <p className="text-gray-900">{results.concreteVolume} m³</p>
              </div>
              <div>
                <p className="text-gray-700 font-semibold">Steel Weight:</p>
                <p className="text-gray-900">{results.steelWeight} kg</p>
              </div>
              <div>
                <p className="text-gray-700 font-semibold">Shuttering Area:</p>
                <p className="text-gray-900">{results.shutteringArea} m²</p>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default SlabCalculator;
