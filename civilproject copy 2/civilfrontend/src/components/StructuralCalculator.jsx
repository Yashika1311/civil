import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StructuralCalculator = () => {
    const [structureData, setStructureData] = useState({
        type: 'beam',
        dimensions: {
            length: '',
            width: '',
            depth: '',
            height: '',
            topLength: '',
            topWidth: '',
            unit: 'mm'
        },
        reinforcement: {
            mainBars: {
                diameter: '',
                count: '',
                spacing: '',
                unit: 'mm'
            },
            stirrups: {
                diameter: '',
                spacing: '',
                cover: '',
                unit: 'mm'
            },
            ties: {
                diameter: '',
                spacing: '',
                cover: '',
                unit: 'mm'
            },
            distributionBars: {
                diameter: '',
                spacing: '',
                unit: 'mm'
            }
        }
    });

    const [calculationResults, setCalculationResults] = useState(null);
    const [error, setError] = useState('');
    const [calculationHistory, setCalculationHistory] = useState([]);

    useEffect(() => {
        fetchCalculationHistory();
    }, []);

    const handleInputChange = (section, subsection, field, value) => {
        setStructureData(prev => {
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
            const response = await axios.get('http://localhost:5001/api/structures/history');
            setCalculationHistory(response.data);
        } catch (err) {
            setError('Error fetching calculation history');
            console.error('Error fetching history:', err);
        }
    };

    const calculateStructure = async (e) => {
        e.preventDefault();
        setError('');
        
        // Validate inputs
        const requiredFields = {
            beam: {
                dimensions: ['length', 'width', 'depth'],
                reinforcement: {
                    mainBars: ['diameter', 'count'],
                    stirrups: ['diameter', 'spacing', 'cover']
                }
            },
            column: {
                dimensions: ['length', 'width', 'height'],
                reinforcement: {
                    mainBars: ['diameter', 'count'],
                    ties: ['diameter', 'spacing', 'cover']
                }
            },
            footing: {
                dimensions: ['length', 'width', 'depth'],
                reinforcement: {
                    mainBars: ['diameter', 'spacing']
                }
            },
            slab: {
                dimensions: ['length', 'width', 'depth'],
                reinforcement: {
                    mainBars: ['diameter', 'spacing'],
                    distributionBars: ['diameter', 'spacing']
                }
            }
        };

        const validateFields = (data, fields) => {
            for (const [section, requirements] of Object.entries(fields)) {
                if (section === 'dimensions') {
                    for (const field of requirements) {
                        if (!data.dimensions[field]) {
                            throw new Error(`Please enter ${field} for dimensions`);
                        }
                    }
                } else if (section === 'reinforcement') {
                    for (const [barType, barFields] of Object.entries(requirements)) {
                        for (const field of barFields) {
                            if (!data.reinforcement[barType][field]) {
                                throw new Error(`Please enter ${field} for ${barType}`);
                            }
                        }
                    }
                }
            }
        };

        try {
            validateFields(structureData, requiredFields[structureData.type]);

            const response = await axios.post('http://localhost:5001/api/structures/calculate', structureData);
            setCalculationResults(response.data.result);
            fetchCalculationHistory();
        } catch (err) {
            if (err.message) {
                setError(err.message);
            } else {
                setError(err.response?.data?.error || 'Error performing calculation');
            }
            console.error('Calculation error:', err);
        }
    };

    const renderDimensionsInputs = () => {
        const fields = {
            beam: ['length', 'width', 'depth'],
            column: ['length', 'width', 'height'],
            footing: ['length', 'width', 'depth', 'topLength', 'topWidth'],
            slab: ['length', 'width', 'depth']
        };

        return fields[structureData.type].map(field => (
            <div key={field} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.charAt(0).toUpperCase() + field.slice(1)} (mm)
                </label>
                <input
                    type="number"
                    value={structureData.dimensions[field]}
                    onChange={(e) => handleInputChange('dimensions', null, field, e.target.value)}
                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                />
            </div>
        ));
    };

    const renderReinforcementInputs = () => {
        const getFields = () => {
            switch (structureData.type) {
                case 'beam':
                    return {
                        mainBars: ['diameter', 'count'],
                        stirrups: ['diameter', 'spacing', 'cover']
                    };
                case 'column':
                    return {
                        mainBars: ['diameter', 'count'],
                        ties: ['diameter', 'spacing', 'cover']
                    };
                case 'footing':
                    return {
                        mainBars: ['diameter', 'spacing']
                    };
                case 'slab':
                    return {
                        mainBars: ['diameter', 'spacing'],
                        distributionBars: ['diameter', 'spacing']
                    };
                default:
                    return {};
            }
        };

        const fields = getFields();
        return Object.entries(fields).map(([section, sectionFields]) => (
            <div key={section} className="mb-6">
                <h3 className="text-lg font-semibold mb-3">
                    {section.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                {sectionFields.map(field => (
                    <div key={field} className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {field.charAt(0).toUpperCase() + field.slice(1)} (mm)
                        </label>
                        <input
                            type="number"
                            value={structureData.reinforcement[section][field]}
                            onChange={(e) => handleInputChange('reinforcement', section, field, e.target.value)}
                            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                            min="0"
                        />
                    </div>
                ))}
            </div>
        ));
    };

    const renderResults = () => {
        if (!calculationResults) return null;

        return (
            <div className="mt-8 p-6 bg-white rounded-lg shadow">
                <h3 className="text-xl font-bold mb-4">Calculation Results</h3>
                
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

                    {calculationResults.steel.mainBars && (
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
                    )}

                    {calculationResults.steel.stirrups && (
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
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Structural Calculator</h2>
            
            <form onSubmit={calculateStructure} className="space-y-6">
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Structure Type
                    </label>
                    <select
                        value={structureData.type}
                        onChange={(e) => handleInputChange('type', null, null, e.target.value)}
                        className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="beam">Beam</option>
                        <option value="column">Column</option>
                        <option value="footing">Footing</option>
                        <option value="slab">Slab</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Dimensions</h3>
                        {renderDimensionsInputs()}
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Reinforcement</h3>
                        {renderReinforcementInputs()}
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
                                <p className="font-medium">{calc.type.charAt(0).toUpperCase() + calc.type.slice(1)}</p>
                                <p className="text-sm text-gray-600">
                                    Concrete: {calc.calculations.concrete.volume.toFixed(3)} m³ | 
                                    Steel: {calc.calculations.steel.totalWeight.toFixed(2)} kg
                                </p>
                                <p className="text-xs text-gray-500">
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

export default StructuralCalculator;
