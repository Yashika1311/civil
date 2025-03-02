import React, { useState } from 'react';
import { read, utils } from 'xlsx';

const BOQCalculator = () => {
  const [boqData, setBOQData] = useState([]);
  const [convertedData, setConvertedData] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Unit conversion factors
  const conversionFactors = {
    // Length
    'ft': { to: 'm', factor: 0.3048 },
    'inch': { to: 'm', factor: 0.0254 },
    'yard': { to: 'm', factor: 0.9144 },
    
    // Area
    'ft²': { to: 'm²', factor: 0.092903 },
    'sq ft': { to: 'm²', factor: 0.092903 },
    'square feet': { to: 'm²', factor: 0.092903 },
    
    // Volume
    'ft³': { to: 'm³', factor: 0.0283168 },
    'cu ft': { to: 'm³', factor: 0.0283168 },
    'cubic feet': { to: 'm³', factor: 0.0283168 },
    'gallons': { to: 'L', factor: 3.78541 },
    
    // Weight
    'kg': { to: 'tons', factor: 0.001 },
    'lbs': { to: 'kg', factor: 0.453592 },
    
    // Numbers to Volume (for bricks)
    'Nos': { to: 'm³', factor: 0.001 }, // Approximate volume per brick
  };

  const standardUnits = {
    'Earthworks': 'm³',
    'Concrete': 'm³',
    'Masonry': ['m²', 'm³'],
    'Steel': ['kg', 'tons'],
    'Plumbing': ['m', 'L'],
    'Electrical': ['m', 'kW'],
    'Finishing': 'm²',
    'Mechanical': ['kW', 'm']
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    setIsProcessing(true);
    setErrors([]);

    try {
      const data = await readExcelFile(file);
      setBOQData(data);
      processAndConvertBOQ(data);
    } catch (error) {
      setErrors([`Error reading file: ${error.message}`]);
    }

    setIsProcessing(false);
  };

  const readExcelFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const workbook = read(e.target.result, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const data = utils.sheet_to_json(worksheet);
          resolve(data);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const processAndConvertBOQ = (data) => {
    const newErrors = [];
    const converted = data.map((item, index) => {
      try {
        const quantity = parseFloat(item.Quantity);
        const unit = item.Unit?.toLowerCase();
        
        if (!unit) {
          newErrors.push(`Row ${index + 1}: Missing unit`);
          return { ...item, convertedQuantity: quantity, standardUnit: 'Unknown' };
        }

        const conversion = conversionFactors[unit];
        if (conversion) {
          return {
            ...item,
            convertedQuantity: (quantity * conversion.factor).toFixed(2),
            standardUnit: conversion.to,
            originalUnit: unit
          };
        } else {
          // If unit is already standard, keep as is
          return {
            ...item,
            convertedQuantity: quantity.toFixed(2),
            standardUnit: unit,
            originalUnit: unit
          };
        }
      } catch (error) {
        newErrors.push(`Row ${index + 1}: ${error.message}`);
        return item;
      }
    });

    setConvertedData(converted);
    setErrors(newErrors);
  };

  const downloadConvertedData = () => {
    const worksheet = utils.json_to_sheet(convertedData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Converted BOQ');
    
    // Generate and download file
    const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'converted_boq.xlsx';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6">BOQ Verification & Unit Conversion</h2>
        
        {/* File Upload Section */}
        <div className="mb-8">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              className="hidden"
              id="boq-file"
            />
            <label
              htmlFor="boq-file"
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors cursor-pointer"
            >
              Upload BOQ File
            </label>
            <p className="mt-2 text-sm text-gray-600">
              Supported formats: Excel (XLSX, XLS), CSV
            </p>
          </div>
        </div>

        {/* Processing Status */}
        {isProcessing && (
          <div className="text-center mb-4">
            <p className="text-blue-600">Processing BOQ data...</p>
          </div>
        )}

        {/* Errors Display */}
        {errors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg">
            <h3 className="text-red-700 font-semibold mb-2">Validation Errors:</h3>
            <ul className="list-disc pl-5">
              {errors.map((error, index) => (
                <li key={index} className="text-red-600">{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Results Table */}
        {convertedData.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Original Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Original Unit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Converted Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Standard Unit
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {convertedData.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">{item.Item}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.Quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.originalUnit}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.convertedQuantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.standardUnit}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Download Button */}
            <div className="mt-6 text-center">
              <button
                onClick={downloadConvertedData}
                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors"
              >
                Download Converted BOQ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BOQCalculator;
