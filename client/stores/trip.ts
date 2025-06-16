import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTripStore = defineStore('trip', () => {
  const selectedTrip = ref({});
  const selectedSeat = ref({});
  const availableSeats = ref({});

  const fetchAvailableSeats = async ({
    tripId,
    fromStopId,
    toStopId,
  }: {
    tripId: string;
    fromStopId: string;
    toStopId: string;
  }) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/trip/available-seats/${tripId}?fromStopId=${fromStopId}&toStopId=${toStopId}`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      availableSeats.value = data.seats;
      console.log('useSearchStore ~ data:', data);
    } catch (error) {
      console.error('useSearchStore ~ fetchAvailableTrips error:', error);
    }
  };

  const fetchTrip = async (tripId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/trip/${tripId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      selectedTrip.value = data.trip;
      console.log('useTripStore ~ data:', data);
    } catch (error) {
      console.error('useTripStore ~ fetchTrip error:', error);
      throw error;
    }
  };

  const fetchTripDetails = async (
    tripId: string,
    fromStopId: string,
    toStopId: string
  ) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/trip/trip-details/${tripId}?fromStopId=${fromStopId}&toStopId=${toStopId}`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      selectedTrip.value = data.trip;
      console.log('useTripStore ~ fetchTripDetails:', data);
    } catch (error) {
      console.error('useTripStore ~ fetchTrip error:', error);
      throw error;
    }
  };

  return {
    selectedTrip,
    selectedSeat,
    availableSeats,
    fetchAvailableSeats,
    fetchTripDetails,
    fetchTrip,
  };
});
