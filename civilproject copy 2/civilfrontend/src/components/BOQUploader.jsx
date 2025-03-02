import React, { useState } from 'react';
import axios from 'axios';

const unitMappings = {
    'cum': 'm³',
    'cft': 'm³',
    'm3': 'm³',
    'm³': 'm³',
    'bags': 'kg',
    'kg': 'kg',
    'nos': 'pcs',
    'pcs': 'pcs'
};

const BOQUploader = () => {
    const [file, setFile] = useState(null);
    const [boqData, setBOQData] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editableData, setEditableData] = useState([]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                const bstr = evt.target.result;
                const lines = bstr.split('\n');
                const headers = lines[0].split(',');
                const items = lines.slice(1).map(line => {
                    const values = line.split(',');
                    return {
                        quantity: parseFloat(values[0]) || 0,
                        unit: { original: '', iso: '' }
                    };
                });
                setEditableData(items);
            };
            reader.readAsText(file);
        }
    };

    const handleUnitChange = (index, unit) => {
        const newData = [...editableData];
        newData[index] = {
            ...newData[index],
            unit: {
                original: unit,
                iso: unitMappings[unit.toLowerCase()] || ''
            }
        };
        setEditableData(newData);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a file to upload');
            return;
        }

        const formData = new FormData();
        formData.append('boqFile', file);
        formData.append('data', JSON.stringify(editableData));

        try {
            const response = await axios.post('http://localhost:5001/api/boq/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setBOQData(response.data);
            setSuccess('BOQ uploaded successfully!');
        } catch (err) {
            setError(err.response?.data?.error || 'Error uploading BOQ');
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">BOQ Verification & Unit Conversion</h2>
            
            <form onSubmit={handleUpload} className="space-y-4">
                <div>
                    <label className="block mb-2">Upload BOQ File</label>
                    <input
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileChange}
                        className="w-full p-2 border rounded"
                    />
                    <p className="text-sm text-gray-600 mt-1">Supported formats: Excel (XLSX, XLS), CSV</p>
                </div>
                
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Upload and Process
                </button>
            </form>

            {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>
            )}

            {success && (
                <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">{success}</div>
            )}

            {editableData.length > 0 && (
                <div className="mt-4">
                    <h3 className="font-bold mb-2">BOQ Data:</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-2 border">Original Quantity</th>
                                    <th className="p-2 border">Unit</th>
                                    <th className="p-2 border">Converted Quantity</th>
                                    <th className="p-2 border">Standard Unit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {editableData.map((item, index) => (
                                    <tr key={index}>
                                        <td className="p-2 border">{item.quantity}</td>
                                        <td className="p-2 border">
                                            <select
                                                value={item.unit.original}
                                                onChange={(e) => handleUnitChange(index, e.target.value)}
                                                className="w-full p-1 border rounded"
                                            >
                                                <option value="">Select Unit</option>
                                                {Object.keys(unitMappings).map(unit => (
                                                    <option key={unit} value={unit}>{unit.toUpperCase()}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="p-2 border">
                                            {item.unit.original ? (item.quantity * (item.unit.original === 'cft' ? 0.0283168 : 1)).toFixed(2) : '-'}
                                        </td>
                                        <td className="p-2 border">{item.unit.iso || '-'}</td>
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

export default BOQUploader;