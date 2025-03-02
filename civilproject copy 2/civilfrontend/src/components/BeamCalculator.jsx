import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BeamCalculator = () => {
    const [beamData, setBeamData] = useState({
        dimensions: {
            length: '',
            width: '',
            depth: '',
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

    const API_BASE_URL = 'http://localhost:8080/api/beam';

    useEffect(() => {
        fetchCalculationHistory();
    }, []);

    const handleInputChange = (section, subsection, field, value) => {
        setBeamData(prev => {
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

    const calculateBeam = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const response = await axios.post(`${API_BASE_URL}/calculate`, beamData);
            setCalculationResults(response.data.result);
            fetchCalculationHistory();
        } catch (err) {
            setError(err.response?.data?.error || 'Error performing calculation');
            console.error('Calculation error:', err);
        }
    };

    const renderResults = () => {
        if (!calculationResults) return null;

        return (
            <div className="mt-8 p-6 bg-white rounded-lg shadow">
                <h3 className="text-xl font-bold mb-4">Beam Calculation Results</h3>
                
                <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-2">Concrete</h4>
                    <p>Volume: {calculationResults.concrete.volume.toFixed(3)} {calculationResults.concrete.unit}</p>
                </div>

                <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-2">Steel</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="font-medium">Total Weight:</p>
                            <p>{calculationResults.steel.totalWeight.toFixed(2)} {calculationResults.steel.unit}</p>
                        </div>
                        <div>
                            <p className="font-medium">Steel Percentage:</p>
                            <p>{calculationResults.steel.percentage.toFixed(2)}%</p>
                        </div>
                    </div>

                    <div className="mt-4">
                        <p className="font-medium">Main Bars:</p>
                        <ul className="list-disc list-inside pl-4">
                            <li>Diameter: {calculationResults.steel.mainBars.diameter} mm</li>
                            <li>Count: {calculationResults.steel.mainBars.count}</li>
                            <li>Total Length: {calculationResults.steel.mainBars.totalLength.toFixed(0)} mm</li>
                            <li>Weight: {calculationResults.steel.mainBars.weight.toFixed(2)} kg</li>
                            <li>Unit Weight: {calculationResults.steel.mainBars.unitWeight.toFixed(3)} kg/m</li>
                        </ul>
                    </div>

                    <div className="mt-4">
                        <p className="font-medium">Stirrups:</p>
                        <ul className="list-disc list-inside pl-4">
                            <li>Diameter: {calculationResults.steel.stirrups.diameter} mm</li>
                            <li>Count: {calculationResults.steel.stirrups.count}</li>
                            <li>Spacing: {calculationResults.steel.stirrups.spacing} mm</li>
                            <li>Perimeter: {calculationResults.steel.stirrups.perimeter.toFixed(0)} mm</li>
                            <li>Total Length: {calculationResults.steel.stirrups.totalLength.toFixed(0)} mm</li>
                            <li>Weight: {calculationResults.steel.stirrups.weight.toFixed(2)} kg</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Beam Calculator</h2>
            
            <form onSubmit={calculateBeam} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Dimensions</h3>
                        <div className="space-y-4">
                            {['length', 'width', 'depth'].map(field => (
                                <div key={field}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {field.charAt(0).toUpperCase() + field.slice(1)} (mm)
                                    </label>
                                    <input
                                        type="number"
                                        value={beamData.dimensions[field]}
                                        onChange={(e) => handleInputChange('dimensions', null, field, e.target.value)}
                                        className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                        min="0"
                                        required
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Reinforcement</h3>
                        <div className="space-y-6">
                            <div>
                                <h4 className="font-medium mb-2">Main Bars</h4>
                                <div className="space-y-4">
                                    {['diameter', 'count'].map(field => (
                                        <div key={field}>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                {field.charAt(0).toUpperCase() + field.slice(1)} {field === 'diameter' ? '(mm)' : ''}
                                            </label>
                                            <input
                                                type="number"
                                                value={beamData.reinforcement.mainBars[field]}
                                                onChange={(e) => handleInputChange('reinforcement', 'mainBars', field, e.target.value)}
                                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                                min="0"
                                                required
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium mb-2">Stirrups</h4>
                                <div className="space-y-4">
                                    {['diameter', 'spacing', 'cover'].map(field => (
                                        <div key={field}>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                {field.charAt(0).toUpperCase() + field.slice(1)} (mm)
                                            </label>
                                            <input
                                                type="number"
                                                value={beamData.reinforcement.stirrups[field]}
                                                onChange={(e) => handleInputChange('reinforcement', 'stirrups', field, e.target.value)}
                                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                                min="0"
                                                required
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Calculate
                </button>
            </form>

            {error && (
                <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {renderResults()}

            {calculationHistory.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4">Calculation History</h3>
                    <div className="space-y-4">
                        {calculationHistory.map((calc) => (
                            <div key={calc._id} className="p-4 bg-gray-50 rounded">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm">
                                            <span className="font-medium">Dimensions:</span> {calc.dimensions.length}×{calc.dimensions.width}×{calc.dimensions.depth} mm
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">Main Bars:</span> {calc.reinforcement.mainBars.count}×Ø{calc.reinforcement.mainBars.diameter}mm
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm">
                                            <span className="font-medium">Concrete:</span> {calc.calculations.concrete.volume.toFixed(3)} m³
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">Steel:</span> {calc.calculations.steel.totalWeight.toFixed(2)} kg ({calc.calculations.steel.percentage.toFixed(2)}%)
                                        </p>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    {new Date(calc.createdAt).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BeamCalculator;
