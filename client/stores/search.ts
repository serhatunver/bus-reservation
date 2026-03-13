import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getLocalTimeZone, today } from '@internationalized/date';
import type { SearchTripResponse, Trip } from '~/types/trip';

interface SearchFormStop {
  id: string;
  name: string;
}

interface SearchFormState {
  fromStop: SearchFormStop;
  toStop: SearchFormStop;
  outboundDate: ReturnType<typeof today>;
}

export const useSearchStore = defineStore('search', () => {
  const { get } = useApi();

  const searchForm = ref<SearchFormState>({
    fromStop: {
      id: '684a07d98cac1cdecbe22ea1',
      name: 'Malatya',
    },
    toStop: {
      id: '684a07d98cac1cdecbe22e6c',
      name: 'Adana',
    },
    outboundDate: today(getLocalTimeZone()),
  });

  const availableTrips = ref<Trip[]>([]);

  const swapCities = () => {
    const temp = searchForm.value.fromStop;
    searchForm.value.fromStop = searchForm.value.toStop;
    searchForm.value.toStop = temp;
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
          id: data.fromStop._id,
          name: data.fromStop.name,
        };
      }

      if (data.toStop) {
        searchForm.value.toStop = {
          id: data.toStop._id,
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
    swapCities,
    fetchAvailableTrips,
  };
});
