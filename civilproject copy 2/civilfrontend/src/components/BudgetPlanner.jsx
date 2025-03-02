import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BudgetPlanner = () => {
    const [budget, setBudget] = useState({
        projectName: '',
        totalBudget: {
            amount: '',
            currency: 'INR'
        },
        categories: []
    });

    const [newCategory, setNewCategory] = useState({
        name: '',
        allocation: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setBudget({
                ...budget,
                [parent]: {
                    ...budget[parent],
                    [child]: value
                }
            });
        } else {
            setBudget({
                ...budget,
                [name]: value
            });
        }
    };

    const handleAddCategory = () => {
        if (!newCategory.name || !newCategory.allocation) {
            setError('Please fill in both category name and allocation');
            return;
        }

        setBudget({
            ...budget,
            categories: [...budget.categories, { ...newCategory, spent: 0 }]
        });
        setNewCategory({ name: '', allocation: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5001/api/budgets', budget);
            setSuccess('Budget plan created successfully!');
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Error creating budget plan');
            setSuccess('');
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Budget Planner</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-2">Project Name</label>
                    <input
                        type="text"
                        name="projectName"
                        value={budget.projectName}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2">Total Budget</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            name="totalBudget.amount"
                            value={budget.totalBudget.amount}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                        <select
                            name="totalBudget.currency"
                            value={budget.totalBudget.currency}
                            onChange={handleInputChange}
                            className="p-2 border rounded"
                        >
                            <option value="INR">INR</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                        </select>
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold mb-2">Budget Categories</h3>
                    <div className="flex gap-2 mb-2">
                        <input
                            type="text"
                            placeholder="Category Name"
                            value={newCategory.name}
                            onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                            className="flex-1 p-2 border rounded"
                        />
                        <input
                            type="number"
                            placeholder="Allocation"
                            value={newCategory.allocation}
                            onChange={(e) => setNewCategory({...newCategory, allocation: e.target.value})}
                            className="w-32 p-2 border rounded"
                        />
                        <button
                            type="button"
                            onClick={handleAddCategory}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Add
                        </button>
                    </div>

                    <div className="space-y-2">
                        {budget.categories.map((category, index) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                                <span>{category.name}</span>
                                <span>{category.allocation} {budget.totalBudget.currency}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Create Budget Plan
                </button>
            </form>

            {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}

            {success && (
                <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
                    {success}
                </div>
            )}
        </div>
    );
};

export default BudgetPlanner;
