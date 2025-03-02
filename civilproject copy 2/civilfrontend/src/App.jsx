import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BeamCalculator from './components/BeamCalculator';
import ColumnCalculator from './components/ColumnCalculator';
import FootingCalculator from './components/FootingCalculator';
import SlabCalculator from './components/SlabCalculator';
import EarthworkCalculator from './components/EarthworkCalculator';
import BOQCalculator from './components/BOQCalculator';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-12">Civil Engineering Calculator</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Link to="/beam" className="block">
          <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-8 text-center cursor-pointer">
            <div className="w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m14 0l-7-7m7 7l-7 7"/>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-4">Beam Calculator</h2>
            <p className="text-gray-600">Calculate beam dimensions, reinforcement, and material quantities</p>
          </div>
        </Link>
        
        <Link to="/column" className="block">
          <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-8 text-center cursor-pointer">
            <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0v12m0-12L4 19"/>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-4">Column Calculator</h2>
            <p className="text-gray-600">Calculate column dimensions, reinforcement, and material quantities</p>
          </div>
        </Link>

        <Link to="/footing" className="block">
          <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-8 text-center cursor-pointer">
            <div className="w-20 h-20 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-4">Footing Calculator</h2>
            <p className="text-gray-600">Calculate footing dimensions, reinforcement, and material quantities</p>
          </div>
        </Link>

        <Link to="/slab" className="block">
          <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-8 text-center cursor-pointer">
            <div className="w-20 h-20 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-4">Slab Calculator</h2>
            <p className="text-gray-600">Calculate slab dimensions, reinforcement, and shuttering area</p>
          </div>
        </Link>

        <Link to="/earthwork" className="block">
          <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-8 text-center cursor-pointer">
            <div className="w-20 h-20 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-4">Earthwork Calculator</h2>
            <p className="text-gray-600">Calculate earthwork volumes using various methods</p>
          </div>
        </Link>

        <Link to="/boq" className="block">
          <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-8 text-center cursor-pointer">
            <div className="w-20 h-20 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-4">BOQ Calculator</h2>
            <p className="text-gray-600">Verify and convert BOQ units to ISO standards</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link to="/" className="text-xl font-bold text-gray-800 hover:text-gray-600">
                    Civil Calculator
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="py-10">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/beam" element={<BeamCalculator />} />
            <Route path="/column" element={<ColumnCalculator />} />
            <Route path="/footing" element={<FootingCalculator />} />
            <Route path="/slab" element={<SlabCalculator />} />
            <Route path="/earthwork" element={<EarthworkCalculator />} />
            <Route path="/boq" element={<BOQCalculator />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
