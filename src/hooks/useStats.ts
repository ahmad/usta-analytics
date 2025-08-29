import { useQuery } from '@tanstack/react-query';
import { FilterState } from '@/components/Filters';

interface SectionData {
  sections: Array<{
    section_id: string;
    section_count: string;
    section_name: string;
  }>;
}

interface DistrictData {
  districts: Array<{
    district_id: string;
    district_name: string;
    count: string;
  }>;
}

interface AreaData {
  areas: Array<{
    area_id: string;
    area_name: string;
    count: string;
  }>;
}

interface RatingData {
  rating: Array<{
    rating: number;
    male_rating: string;
    female_rating: string;
  }>;
}

interface GenderData {
  gender: Array<{
    gender: string;
    gender_count: string;
  }>;
}

interface StateData {
  state: Array<{
    state: string;
    state_count: string;
  }>;
}

async function fetchSections(filters: FilterState): Promise<SectionData> {
  const params = new URLSearchParams();
  if (filters.gender) params.append('gender', filters.gender);
  if (filters.rating) params.append('rating', filters.rating);

  const url = `/api/stats/sections${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch sections data');
  }
  return response.json();
}

async function fetchDistricts(filters: FilterState): Promise<DistrictData> {
  if (!filters.section) {
    return { districts: [] };
  }

  const params = new URLSearchParams();
  params.append('section', filters.section);
  if (filters.gender) params.append('gender', filters.gender);
  if (filters.rating) params.append('rating', filters.rating);

  const url = `/api/stats/districts?${params.toString()}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch districts data');
  }
  return response.json();
}

async function fetchAreas(filters: FilterState): Promise<AreaData> {
  if (!filters.section || !filters.district) {
    return { areas: [] };
  }

  const params = new URLSearchParams();
  params.append('section', filters.section);
  params.append('district', filters.district);
  if (filters.gender) params.append('gender', filters.gender);
  if (filters.rating) params.append('rating', filters.rating);

  const url = `/api/stats/areas?${params.toString()}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch areas data');
  }
  return response.json();
}

async function fetchRatingStats(filters: FilterState): Promise<RatingData> {
  const params = new URLSearchParams();
  
  if (filters.section) params.append('section', filters.section);
  if (filters.district) params.append('district', filters.district);
  if (filters.area) params.append('area', filters.area);
  if (filters.gender) params.append('gender', filters.gender);
  if (filters.rating) params.append('rating', filters.rating);

  const url = `/api/stats/rating${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch rating data');
  }
  return response.json();
}

async function fetchGenderStats(filters: FilterState): Promise<GenderData> {
  const params = new URLSearchParams();
  
  if (filters.section) params.append('section', filters.section);
  if (filters.district) params.append('district', filters.district);
  if (filters.area) params.append('area', filters.area);
  if (filters.gender) params.append('gender', filters.gender);
  if (filters.rating) params.append('rating', filters.rating);

  const url = `/api/stats/gender${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch gender data');
  }
  return response.json();
}

async function fetchStateStats(filters: FilterState): Promise<StateData> {
  const params = new URLSearchParams();
  
  if (filters.section) params.append('section', filters.section);
  if (filters.district) params.append('district', filters.district);
  if (filters.area) params.append('area', filters.area);
  if (filters.gender) params.append('gender', filters.gender);
  if (filters.rating) params.append('rating', filters.rating);

  const url = `/api/stats/state${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch state data');
  }
  return response.json();
}

export function useStats(filters: FilterState) {
  const sectionsQuery = useQuery({
    queryKey: ['sections', filters],
    queryFn: () => fetchSections(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: filters.section === '', // Only enabled when no section is selected
  });

  const districtsQuery = useQuery({
    queryKey: ['districts', filters],
    queryFn: () => fetchDistricts(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: filters.section !== '' && filters.district === '', // Only enabled when section is selected but no district
  });

  const areasQuery = useQuery({
    queryKey: ['areas', filters],
    queryFn: () => fetchAreas(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: filters.section !== '' && filters.district !== '', // Only enabled when both section and district are selected
  });

  const ratingQuery = useQuery({
    queryKey: ['rating', filters],
    queryFn: () => fetchRatingStats(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const genderQuery = useQuery({
    queryKey: ['gender', filters],
    queryFn: () => fetchGenderStats(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const stateQuery = useQuery({
    queryKey: ['state', filters],
    queryFn: () => fetchStateStats(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  // Determine which chart data to show based on filters
  let chartData: Array<{
    section_id?: string;
    section_name?: string;
    section_count?: string;
    district_id?: string;
    district_name?: string;
    count?: string;
    area_id?: string;
    area_name?: string;
  }> = [];
  let chartType: 'sections' | 'districts' | 'areas' = 'sections';

  if (filters.section !== '' && filters.district !== '') {
    // Show areas chart when both section and district are selected
    chartData = areasQuery.data?.areas || [];
    chartType = 'areas';
  } else if (filters.section !== '') {
    // Show districts chart when only section is selected
    chartData = districtsQuery.data?.districts || [];
    chartType = 'districts';
  } else {
    // Show sections chart when no section is selected (default)
    chartData = sectionsQuery.data?.sections || [];
    chartType = 'sections';
  }

  // Determine loading state based on which queries are enabled
  const isLoading = 
    (filters.section === '' && sectionsQuery.isLoading) ||
    (filters.section !== '' && filters.district === '' && districtsQuery.isLoading) ||
    (filters.section !== '' && filters.district !== '' && areasQuery.isLoading) ||
    ratingQuery.isLoading || 
    genderQuery.isLoading || 
    stateQuery.isLoading;

  // Determine error state based on which queries are enabled
  const isError = 
    (filters.section === '' && sectionsQuery.isError) ||
    (filters.section !== '' && filters.district === '' && districtsQuery.isError) ||
    (filters.section !== '' && filters.district !== '' && areasQuery.isError) ||
    ratingQuery.isError || 
    genderQuery.isError || 
    stateQuery.isError;

  // Get the first error from enabled queries
  const error = 
    (filters.section === '' && sectionsQuery.error) ||
    (filters.section !== '' && filters.district === '' && districtsQuery.error) ||
    (filters.section !== '' && filters.district !== '' && areasQuery.error) ||
    ratingQuery.error || 
    genderQuery.error || 
    stateQuery.error;

  return {
    data: {
      sections: sectionsQuery.data?.sections || [],
      districts: districtsQuery.data?.districts || [],
      areas: areasQuery.data?.areas || [],
      rating: ratingQuery.data?.rating || [],
      gender: genderQuery.data?.gender || [],
      state: stateQuery.data?.state || [],
      chartData,
      chartType,
    },
    isLoading,
    error,
    isError,
  };
}
