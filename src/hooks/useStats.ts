import { useQuery } from '@tanstack/react-query';

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

async function fetchStats(): Promise<StatsData> {
  const response = await fetch('/api/stats');
  if (!response.ok) {
    throw new Error('Failed to fetch stats data');
  }
  return response.json();
}

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
