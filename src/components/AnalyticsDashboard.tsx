'use client';

import { FilterState } from './Filters';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Users, Trophy, Target, Star, TrendingUp, Award, MapPin, BarChart3 } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';
import { useStats } from '@/hooks/useStats';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

interface AnalyticsDashboardProps {
  filters: FilterState;
}

export default function AnalyticsDashboard({ filters }: AnalyticsDashboardProps) {
  const { data, isLoading, error, isError } = useStats(filters);
  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError || !data) {
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

  // Check if we have any data after filtering
  const hasData = data.sections.length > 0 || data.rating.length > 0 || data.gender.length > 0 || data.state.length > 0;
  
  if (!isLoading && !hasData) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="text-gray-600 text-lg font-semibold">
            No data found for the selected filters
          </div>
          <p className="text-gray-500 mt-2">
            Try adjusting your filter criteria to see results
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate totals
  const totalPlayers = data.gender.reduce((sum, g) => sum + parseInt(g.gender_count), 0);
  const totalSections = data.sections.length;
  const totalStates = data.state.length;
  const averageRating = data.rating.reduce((sum, r) => sum + r.rating, 0) / data.rating.length;

  // Chart 1: Dynamic Chart based on filter selection
  const getChartData = () => {
    const chartType = data.chartType;
    const chartData = data.chartData;
    
    let labels: string[] = [];
    let dataValues: number[] = [];
    
    if (chartType === 'sections') {
      labels = chartData.map(s => s.section_name?.replace('USTA/', '') || 'Unknown');
      dataValues = chartData.map(s => parseInt(s.section_count || '0'));
    } else if (chartType === 'districts') {
      labels = chartData.map(d => d.district_name || 'Unknown');
      dataValues = chartData.map(d => parseInt(d.count || '0'));
    } else if (chartType === 'areas') {
      labels = chartData.map(a => a.area_name || 'Unknown');
      dataValues = chartData.map(a => parseInt(a.count || '0'));
    }
    
    return {
      labels,
      datasets: [
        {
          label: 'Player Count',
          data: dataValues,
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const chartData = getChartData();

  // Chart 2: Rating Distribution by Gender (Line Chart)
  const ratingChartData = {
    labels: data.rating.map(r => r.rating.toString()),
    datasets: [
      {
        label: 'Male',
        data: data.rating.map(r => parseInt(r.male_rating)),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Female',
        data: data.rating.map(r => parseInt(r.female_rating)),
        borderColor: 'rgba(236, 72, 153, 1)',
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Chart 3: Gender Distribution (Doughnut Chart)
  const genderChartData = {
    labels: data.gender.map(g => g.gender),
    datasets: [
      {
        data: data.gender.map(g => parseInt(g.gender_count)),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(236, 72, 153, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Chart 4: Top States Distribution (Pie Chart - Top 10)
  const topStates = data.state
    .sort((a, b) => parseInt(b.state_count) - parseInt(a.state_count))
    .slice(0, 10);
  
  const statesChartData = {
    labels: topStates.map(s => s.state),
    datasets: [
      {
        data: topStates.map(s => parseInt(s.state_count)),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(6, 182, 212, 0.8)',
          'rgba(168, 85, 247, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(251, 146, 60, 1)',
          'rgba(6, 182, 212, 1)',
          'rgba(168, 85, 247, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  // Get chart title based on current chart type
  const getChartTitle = () => {
    switch (data.chartType) {
      case 'sections':
        return 'Sections Distribution';
      case 'districts':
        return 'Districts Distribution';
      case 'areas':
        return 'Areas Distribution';
      default:
        return 'Distribution Chart';
    }
  };

  // Get top items title based on current chart type
  const getTopItemsTitle = () => {
    switch (data.chartType) {
      case 'sections':
        return 'Top Sections by Players';
      case 'districts':
        return 'Top Districts by Players';
      case 'areas':
        return 'Top Areas by Players';
      default:
        return 'Top Items by Players';
    }
  };

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
                {hasActiveFilters 
                  ? `Showing ${data.chartType === 'sections' ? 'sections' :
                     data.chartType === 'districts' ? 'districts' :
                     'areas'} data (${totalPlayers.toLocaleString()} players)` 
                  : 'Comprehensive league statistics and insights'
                }
              </p>
            </div>
            {isLoading && (
              <div className="ml-auto">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Players</p>
                  <p className="text-2xl font-bold text-gray-900">{totalPlayers.toLocaleString()}</p>
                </div>
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Sections</p>
                  <p className="text-2xl font-bold text-gray-900">{totalSections}</p>
                </div>
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total States</p>
                  <p className="text-2xl font-bold text-gray-900">{totalStates}</p>
                </div>
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <Star className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</p>
                </div>
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1">
        {/* Chart 1: Dynamic Chart based on filter selection - Hide when no areas data available */}
        {data.chartData.length > 0 ? (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span>{getChartTitle()}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Bar data={chartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        ) : (
          // Show message when no chart data is available
          filters.section && filters.district && (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="text-gray-600 text-lg font-semibold">
                  No areas data available for the selected section and district
                </div>
                <p className="text-gray-500 mt-2">
                  Try selecting a different section or district combination
                </p>
              </CardContent>
            </Card>
          )
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Chart 2: Rating Distribution by Gender */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-orange-600" />
              <span>Rating Distribution by Gender</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Line data={ratingChartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Chart 3: Gender Distribution */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-purple-600" />
              <span>Gender Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Doughnut data={genderChartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Chart 4: Top States Distribution */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-green-600" />
              <span>Top 10 States by Players</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Pie data={statesChartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Summary Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Dynamic Top Table - Hide when no chart data available */}
        {data.chartData.length > 0 && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-blue-600" />
                <span>{getTopItemsTitle()}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.chartData
                  .slice(0, 8)
                  .map((item, index) => {
                    let name: string;
                    let count: number;
                    
                    if (data.chartType === 'sections') {
                      name = item.section_name || 'Unknown';
                      count = parseInt(item.section_count || '0');
                    } else if (data.chartType === 'districts') {
                      name = item.district_name || 'Unknown';
                      count = parseInt(item.count || '0');
                    } else {
                      name = item.area_name || 'Unknown';
                      count = parseInt(item.count || '0');
                    }
                    
                    return (
                      <div key={item.section_id || item.district_id || item.area_id || index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0 ? 'bg-yellow-100 text-yellow-800' :
                            index === 1 ? 'bg-gray-100 text-gray-800' :
                            index === 2 ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {data.chartType === 'sections' ? name.replace('USTA/', '') : name}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">{count.toLocaleString()}</div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rating Distribution Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-orange-600" />
              <span>Rating Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.rating.map((rating) => {
                const total = parseInt(rating.male_rating) + parseInt(rating.female_rating);
                const percentage = ((total / totalPlayers) * 100).toFixed(1);
                return (
                  <div key={rating.rating} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700 w-12">{rating.rating}</span>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">{total.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">{percentage}%</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-3 rounded-full transition-all duration-500 bg-blue-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Status */}
      {hasActiveFilters && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Award className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900">Active Filters</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Showing filtered data for: {Object.entries(filters)
                    .filter(([, value]) => value !== '')
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(', ')}
                </p>
                {isLoading && (
                  <p className="text-xs text-blue-600 mt-1 italic">
                    Refreshing data...
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
