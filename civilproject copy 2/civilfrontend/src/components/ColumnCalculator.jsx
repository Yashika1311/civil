import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ColumnCalculator = () => {
    const [columnData, setColumnData] = useState({
        dimensions: {
            length: '',
            breadth: '',
            height: '',
            unit: 'mm'
        },
        reinforcement: {
            mainBars: {
                diameter: '',
                count: '',
                unit: 'mm'
            },
            stirrups: {
                diameter: '',
                spacing: '',
                cover: '',
                unit: 'mm'
            }
        }
    });

    const [calculationResults, setCalculationResults] = useState(null);
    const [error, setError] = useState('');
    const [calculationHistory, setCalculationHistory] = useState([]);

    const API_BASE_URL = 'http://localhost:8080/api/column';

    useEffect(() => {
        fetchCalculationHistory();
    }, []);

    const handleInputChange = (section, subsection, field, value) => {
        setColumnData(prev => {
            if (subsection) {
                return {
                    ...prev,
                    [section]: {
                        ...prev[section],
                        [subsection]: {
                            ...prev[section][subsection],
                            [field]: value
                        }
                    }
                };
            }
            return {
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value
                }
            };
        });
    };

    const fetchCalculationHistory = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/history`);
            setCalculationHistory(response.data);
        } catch (err) {
            setError('Error fetching calculation history');
            console.error('Error fetching history:', err);
        }
    };

    const calculateColumn = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const response = await axios.post(`${API_BASE_URL}/calculate`, columnData);
            setCalculationResults(response.data.result);
            fetchCalculationHistory();
        } catch (err) {
            setError(err.response?.data?.error || 'Error performing calculation');
            console.error('Calculation error:', err);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Column Calculator</h2>
            
            <form onSubmit={calculateColumn} className="space-y-6">
                {/* Dimensions Section */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-xl font-semibold mb-4">Column Dimensions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Length</label>
                            <input
                                type="number"
                                value={columnData.dimensions.length}
                                onChange={(e) => handleInputChange('dimensions', null, 'length', e.target.value)}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Breadth</label>
                            <input
                                type="number"
                                value={columnData.dimensions.breadth}
                                onChange={(e) => handleInputChange('dimensions', null, 'breadth', e.target.value)}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Height</label>
                            <input
                                type="number"
                                value={columnData.dimensions.height}
                                onChange={(e) => handleInputChange('dimensions', null, 'height', e.target.value)}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Reinforcement Section */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-xl font-semibold mb-4">Reinforcement Details</h3>
                    
                    {/* Main Bars */}
                    <div className="mb-6">
                        <h4 className="text-lg font-medium mb-3">Main Bars</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Diameter (mm)</label>
                                <input
                                    type="number"
                                    value={columnData.reinforcement.mainBars.diameter}
                                    onChange={(e) => handleInputChange('reinforcement', 'mainBars', 'diameter', e.target.value)}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Number of Bars</label>
                                <input
                                    type="number"
                                    value={columnData.reinforcement.mainBars.count}
                                    onChange={(e) => handleInputChange('reinforcement', 'mainBars', 'count', e.target.value)}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Stirrups */}
                    <div>
                        <h4 className="text-lg font-medium mb-3">Stirrups</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Diameter (mm)</label>
                                <input
                                    type="number"
                                    value={columnData.reinforcement.stirrups.diameter}
                                    onChange={(e) => handleInputChange('reinforcement', 'stirrups', 'diameter', e.target.value)}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Spacing (mm)</label>
                                <input
                                    type="number"
                                    value={columnData.reinforcement.stirrups.spacing}
                                    onChange={(e) => handleInputChange('reinforcement', 'stirrups', 'spacing', e.target.value)}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Cover (mm)</label>
                                <input
                                    type="number"
                                    value={columnData.reinforcement.stirrups.cover}
                                    onChange={(e) => handleInputChange('reinforcement', 'stirrups', 'cover', e.target.value)}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                >
                    Calculate
                </button>
            </form>

            {calculationResults && (
                <div className="mt-8 p-6 bg-white rounded-lg shadow">
                    <h3 className="text-xl font-bold mb-4">Column Calculation Results</h3>
                    
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-2">Concrete</h4>
                        <p>Volume: {calculationResults.concrete.volume.toFixed(3)} m³</p>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-2">Steel Reinforcement</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="font-medium">Main Bars:</p>
                                <p>Total Length: {calculationResults.steel.mainBars.totalLength.toFixed(2)} m</p>
                                <p>Weight: {calculationResults.steel.mainBars.weight.toFixed(2)} kg</p>
                            </div>
                            <div>
                                <p className="font-medium">Stirrups:</p>
                                <p>Number of Stirrups: {calculationResults.steel.stirrups.count}</p>
                                <p>Total Length: {calculationResults.steel.stirrups.totalLength.toFixed(2)} m</p>
                                <p>Weight: {calculationResults.steel.stirrups.weight.toFixed(2)} kg</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="font-medium">Total Steel Weight: {calculationResults.steel.totalWeight.toFixed(2)} kg</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Calculation History */}
            {calculationHistory.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4">Calculation History</h3>
                    <div className="bg-white rounded-lg shadow overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dimensions</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Results</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {calculationHistory.map((calc, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(calc.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {`${calc.dimensions.length}x${calc.dimensions.breadth}x${calc.dimensions.height} mm`}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {`Concrete: ${calc.results.concrete.volume.toFixed(2)} m³, Steel: ${calc.results.steel.totalWeight.toFixed(2)} kg`}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ColumnCalculator;
