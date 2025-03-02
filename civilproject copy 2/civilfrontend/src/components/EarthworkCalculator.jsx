import React, { useState } from 'react';

const EarthworkCalculator = () => {
  const [method, setMethod] = useState('average');
  const [inputs, setInputs] = useState({
    // Average Method
    initialLevel: '',
    finalLevel: '',
    length: '',
    width: '',
    
    // Block Method
    block1Height: '',
    block2Height: '',
    block3Height: '',
    block4Height: '',
    blockSize: '',
    
    // Cross-Section Method
    startArea: '',
    endArea: '',
    distance: '',
  });
  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const calculateVolume = () => {
    let volume = 0;
    
    switch (method) {
      case 'average':
        const avgDepth = (Number(inputs.initialLevel) + Number(inputs.finalLevel)) / 2;
        volume = avgDepth * (Number(inputs.length) * Number(inputs.width));
        break;
        
      case 'block':
        const blockArea = Number(inputs.blockSize) * Number(inputs.blockSize);
        volume = (
          Number(inputs.block1Height) * blockArea +
          Number(inputs.block2Height) * blockArea +
          Number(inputs.block3Height) * blockArea +
          Number(inputs.block4Height) * blockArea
        );
        break;
        
      case 'cross-section':
        volume = (Number(inputs.distance) / 2) * 
                (Number(inputs.startArea) + Number(inputs.endArea));
        break;
    }
    
    setResult(volume.toFixed(2));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Earthwork Calculator</h2>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Calculation Method
          </label>
          <select
            className="w-full p-2 border rounded"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            <option value="average">Average Method</option>
            <option value="block">Block Method</option>
            <option value="cross-section">Cross-Section Method</option>
          </select>
        </div>

        <div className="border-t border-gray-200 my-6"></div>

        {method === 'average' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Initial Ground Level (m)
              </label>
              <input
                type="number"
                name="initialLevel"
                value={inputs.initialLevel}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Final Ground Level (m)
              </label>
              <input
                type="number"
                name="finalLevel"
                value={inputs.finalLevel}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Length (m)
              </label>
              <input
                type="number"
                name="length"
                value={inputs.length}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Width (m)
              </label>
              <input
                type="number"
                name="width"
                value={inputs.width}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        )}

        {method === 'block' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Block Size (m)
              </label>
              <input
                type="number"
                name="blockSize"
                value={inputs.blockSize}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Block 1 Height (m)
              </label>
              <input
                type="number"
                name="block1Height"
                value={inputs.block1Height}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Block 2 Height (m)
              </label>
              <input
                type="number"
                name="block2Height"
                value={inputs.block2Height}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Block 3 Height (m)
              </label>
              <input
                type="number"
                name="block3Height"
                value={inputs.block3Height}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Block 4 Height (m)
              </label>
              <input
                type="number"
                name="block4Height"
                value={inputs.block4Height}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        )}

        {method === 'cross-section' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Distance Between Sections (m)
              </label>
              <input
                type="number"
                name="distance"
                value={inputs.distance}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Start Cross-Section Area (m²)
              </label>
              <input
                type="number"
                name="startArea"
                value={inputs.startArea}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                End Cross-Section Area (m²)
              </label>
              <input
                type="number"
                name="endArea"
                value={inputs.endArea}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={calculateVolume}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Calculate Volume
          </button>
        </div>

        {result && (
          <div className="mt-6 text-center">
            <h3 className="text-xl font-bold">
              Volume: {result} m³
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default EarthworkCalculator;
