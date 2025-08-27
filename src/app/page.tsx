'use client';

import { useState } from 'react';
import Filters, { FilterState } from '../components/Filters';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

export default function Home() {
  const [filters, setFilters] = useState<FilterState>({
    section: '',
    district: '',
    area: '',
    gender: '',
    rating: ''
  });

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">USTA League Statistics</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive analytics and insights for USTA tennis leagues across the United States
          </p>
        </div>
        
        <Filters onFiltersChange={handleFiltersChange} />
        <AnalyticsDashboard filters={filters} />
      </div>
    </div>
  );
}
