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
  // For debugging, let's start with just the sections query
  const sectionsQuery = useQuery({
    queryKey: ['sections', filters],
    queryFn: () => fetchSections(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  // Simplified return for debugging
  return {
    data: {
      sections: sectionsQuery.data?.sections || [],
      districts: [],
      areas: [],
      rating: [],
      gender: [],
      state: [],
      chartData: sectionsQuery.data?.sections || [],
      chartType: 'sections',
    },
    isLoading: sectionsQuery.isLoading,
    error: sectionsQuery.error,
    isError: sectionsQuery.isError,
  };
}
