import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getLocalTimeZone, today } from '@internationalized/date';
import type { SearchTripResponse, Trip } from '~/types/trip';
import type { Stop, StopSearchResponse } from '~/types/stop';

interface SearchFormState {
  fromStop: Stop;
  toStop: Stop;
  outboundDate: ReturnType<typeof today>;
}

export const useSearchStore = defineStore('search', () => {
  const { get } = useApi();

  const searchForm = ref<SearchFormState>({
    fromStop: {
      _id: '684a07d98cac1cdecbe22ea1',
      name: 'Malatya',
    },
    toStop: {
      _id: '684a07d98cac1cdecbe22e6c',
      name: 'Adana',
    },
    outboundDate: today(getLocalTimeZone()),
  });

  const availableTrips = ref<Trip[]>([]);

  const stopResults = ref<Stop[]>([]);
  const stopSearchLoading = ref(false);
  const stopSearchError = ref<string | null>(null);

  const swapCities = () => {
    const temp = searchForm.value.fromStop;
    searchForm.value.fromStop = searchForm.value.toStop;
    searchForm.value.toStop = temp;
  };

  const searchStops = async (query: string): Promise<Stop[]> => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      stopResults.value = [];
      stopSearchError.value = null;
      return [];
    }

    stopSearchLoading.value = true;
    stopSearchError.value = null;

    try {
      const data = await get<StopSearchResponse>('/stop/search', {
        query: { q: trimmedQuery },
      });

      stopResults.value = data.stops ?? [];

      console.log('Search results:', stopResults.value);

      return stopResults.value;
    } catch (error) {
      console.error('Error searching stops:', error);
      stopResults.value = [];
      stopSearchError.value =
        error instanceof Error
          ? error.message
          : 'An error occurred while searching stops';
      throw error;
    } finally {
      stopSearchLoading.value = false;
    }
  };

  const clearStopResults = () => {
    stopResults.value = [];
    stopSearchError.value = null;
  };

  const fetchAvailableTrips = async ({
    fromStopId,
    toStopId,
    outboundDate,
  }: {
    fromStopId: string;
    toStopId: string;
    outboundDate: string;
  }) => {
    try {
      const data = await get<SearchTripResponse>('/trip/search', {
        query: {
          fromStopId,
          toStopId,
          outboundDate,
        },
      });

      availableTrips.value = data.trips ?? [];

      if (data.fromStop) {
        searchForm.value.fromStop = {
          _id: data.fromStop._id,
          name: data.fromStop.name,
        };
      }

      if (data.toStop) {
        searchForm.value.toStop = {
          _id: data.toStop._id,
          name: data.toStop.name,
        };
      }

      return data.trips;
    } catch (error) {
      console.error('Error fetching search results:', error);
      availableTrips.value = [];
      throw error;
    }
  };

  return {
    searchForm,
    availableTrips,
    stopResults,
    stopSearchLoading,
    stopSearchError,
    swapCities,
    searchStops,
    clearStopResults,
    fetchAvailableTrips,
  };
});
