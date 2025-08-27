'use client';

import { FilterState } from './Filters';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Users, Trophy, Target, Star, TrendingUp, Award, MapPin, BarChart3 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AnalyticsDashboardProps {
  filters: FilterState;
}

export default function AnalyticsDashboard({ filters }: AnalyticsDashboardProps) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/stats/sections');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="text-red-600 text-lg font-semibold">
            {error?.message || 'Failed to load analytics data'}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold">USTA League Analytics</CardTitle>
              <p className="text-blue-100 mt-2 text-lg">
                Showing sections data ({data.sections?.length || 0} sections)
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Simple Data Display */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Sections Data (Debug)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.sections?.slice(0, 5).map((section: any, index: number) => (
              <div key={index} className="flex justify-between p-2 bg-gray-50 rounded">
                <span>{section.section_name}</span>
                <span>{section.section_count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
