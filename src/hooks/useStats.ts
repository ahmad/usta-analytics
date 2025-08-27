import { useQuery } from '@tanstack/react-query';
import { FilterState } from '@/components/Filters';

interface StatsData {
  section: Array<{
    section_id: string;
    section_count: string;
    section_name: string;
  }>;
  rating: Array<{
    rating: number;
    male_rating: string;
    female_rating: string;
  }>;
  gender: Array<{
    gender: string;
    gender_count: string;
  }>;
  state: Array<{
    state: string;
    state_count: string;
  }>;
}

async function fetchStats(filters: FilterState): Promise<StatsData> {
  const params = new URLSearchParams();
  
  if (filters.section) params.append('section', filters.section);
  if (filters.district) params.append('district', filters.district);
  if (filters.area) params.append('area', filters.area);
  if (filters.gender) params.append('gender', filters.gender);
  if (filters.rating) params.append('rating', filters.rating);

  const url = `/api/stats${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch stats data');
  }
  return response.json();
}

export function useStats(filters: FilterState) {
  return useQuery({
    queryKey: ['stats', filters],
    queryFn: () => fetchStats(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
}
