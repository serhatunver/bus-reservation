import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import {
  DateFormatter,
  type DateValue,
  getLocalTimeZone,
  today,
} from '@internationalized/date';

export const useSearchStore = defineStore('search', () => {
  const router = useRouter();
  const searchForm = ref({
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

  const availableTrips = ref([]);

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
    console.log('useSearchStore ~ searchForm:', searchForm.value);
    try {
      const response = await fetch(
        `http://localhost:3000/api/trip/search?fromStopId=${fromStopId}&toStopId=${toStopId}&outboundDate=${outboundDate}`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      availableTrips.value = data.trips;

      console.log('useSearchStore ~ data:', data);

      searchForm.value.fromStop.id = data.fromStop._id;
      searchForm.value.toStop.id = data.toStop._id;
      searchForm.value.fromStop.name = data.fromStop.name;
      searchForm.value.toStop.name = data.toStop.name;

      console.log('useSearchStore ~ searchForm:', searchForm.value);

      console.log(' fetchAvailableTrips ~ data:', data);
    } catch (error) {
      console.error('Error fetching search results:', error);
      availableTrips.value = [];
    }
  };

  return {
    searchForm,
    availableTrips,
    swapCities,
    fetchAvailableTrips,
  };
});
