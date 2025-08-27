'use client';

import { useState, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface Area {
  area_id: string;
  area_name: string;
}

interface District {
  district_id: string;
  district_name: string;
  areas?: Area[];
}

interface Section {
  section_id: string;
  section_name: string;
  districts: District[];
}

interface FiltersProps {
  onFiltersChange: (filters: FilterState) => void;
}

export interface FilterState {
  section: string;
  district: string;
  area: string;
  gender: string;
  rating: string;
}

const RATINGS = ['2.5', '3.0', '3.5', '4.0', '4.5', '5.0', '5.5'];
const GENDERS = ['Male', 'Female'];

export default function Filters({ onFiltersChange }: FiltersProps) {
  const [sections, setSections] = useState<Section[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    section: '',
    district: '',
    area: '',
    gender: '',
    rating: ''
  });

  useEffect(() => {
    fetch('/api/filters')
      .then(res => res.json())
      .then(setSections);
  }, []);

  useEffect(() => {
    if (filters.section) {
      const selectedSection = sections.find(s => s.section_id === filters.section);
      setDistricts(selectedSection?.districts || []);
      setFilters(prev => ({ ...prev, district: '', area: '' }));
    } else {
      setDistricts([]);
      setAreas([]);
    }
  }, [filters.section, sections]);

  useEffect(() => {
    if (filters.district) {
      const selectedDistrict = districts.find(d => d.district_id === filters.district);
      setAreas(selectedDistrict?.areas || []);
      setFilters(prev => ({ ...prev, area: '' }));
    } else {
      setAreas([]);
    }
  }, [filters.district, districts]);

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      section: '',
      district: '',
      area: '',
      gender: '',
      rating: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <Card className="mb-8 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Filter className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">USTA League Filters</CardTitle>
              <p className="text-gray-600 mt-1">Refine your search to find specific data</p>
            </div>
          </div>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="text-gray-600 hover:text-gray-800"
            >
              <X className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Section Filter */}
          <div className="space-y-2">
            <Label htmlFor="section" className="text-sm font-semibold text-gray-700">
              Section
            </Label>
            <Select value={filters.section} onValueChange={(value) => handleFilterChange('section', value)}>
              <SelectTrigger id="section" className="w-full">
                <SelectValue placeholder="Select Section" />
              </SelectTrigger>
              <SelectContent>
                {sections.map((section) => (
                  <SelectItem key={section.section_id} value={section.section_id}>
                    {section.section_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* District Filter */}
          <div className="space-y-2">
            <Label htmlFor="district" className="text-sm font-semibold text-gray-700">
              District
            </Label>
            <Select 
              value={filters.district} 
              onValueChange={(value) => handleFilterChange('district', value)}
              disabled={!filters.section}
            >
              <SelectTrigger id="district" className="w-full">
                <SelectValue placeholder="Select District" />
              </SelectTrigger>
              <SelectContent>
                {districts.map((district) => (
                  <SelectItem key={district.district_id} value={district.district_id}>
                    {district.district_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Area Filter */}
          <div className="space-y-2">
            <Label htmlFor="area" className="text-sm font-semibold text-gray-700">
              Area
            </Label>
            <Select 
              value={filters.area} 
              onValueChange={(value) => handleFilterChange('area', value)}
              disabled={!filters.district}
            >
              <SelectTrigger id="area" className="w-full">
                <SelectValue placeholder="Select Area" />
              </SelectTrigger>
              <SelectContent>
                {areas.map((area) => (
                  <SelectItem key={area.area_id} value={area.area_id}>
                    {area.area_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Gender Filter */}
          <div className="space-y-2">
            <Label htmlFor="gender" className="text-sm font-semibold text-gray-700">
              Gender
            </Label>
            <Select value={filters.gender} onValueChange={(value) => handleFilterChange('gender', value)}>
              <SelectTrigger id="gender" className="w-full">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                {GENDERS.map((gender) => (
                  <SelectItem key={gender} value={gender}>
                    {gender}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Rating Filter */}
          <div className="space-y-2">
            <Label htmlFor="rating" className="text-sm font-semibold text-gray-700">
              Rating
            </Label>
            <Select value={filters.rating} onValueChange={(value) => handleFilterChange('rating', value)}>
              <SelectTrigger id="rating" className="w-full">
                <SelectValue placeholder="Select Rating" />
              </SelectTrigger>
              <SelectContent>
                {RATINGS.map((rating) => (
                  <SelectItem key={rating} value={rating}>
                    {rating}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters)
                .filter(([, value]) => value !== '')
                .map(([key, value]) => {
                  let displayValue = value;
                  
                  // Show friendly names instead of IDs
                  if (key === 'section' && value) {
                    const selectedSection = sections.find(s => s.section_id === value);
                    displayValue = selectedSection?.section_name || value;
                  } else if (key === 'district' && value) {
                    const selectedDistrict = districts.find(d => d.district_id === value);
                    displayValue = selectedDistrict?.district_name || value;
                  } else if (key === 'area' && value) {
                    const selectedArea = areas.find(a => a.area_id === value);
                    displayValue = selectedArea?.area_name || value;
                  }
                  
                  return (
                    <div
                      key={key}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200"
                    >
                      <span className="capitalize mr-1">{key}:</span>
                      <span className="font-medium">{displayValue}</span>
                      <button
                        onClick={() => handleFilterChange(key as keyof FilterState, '')}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
