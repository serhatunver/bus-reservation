import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Trip, TripResponse, AvailableSeatsResponse } from '~/types/trip';

interface SelectedSeat {
  seatNumber?: number;
  [key: string]: unknown;
}

type AvailableSeatItem =
  | number
  | {
      seatNumber: number;
      isAvailable?: boolean;
      gender?: string | null;
    };

export const useTripStore = defineStore('trip', () => {
  const { get } = useApi();

  const selectedTrip = ref<Trip | null>(null);
  const selectedSeat = ref<SelectedSeat | null>(null);
  const availableSeats = ref<AvailableSeatItem[]>([]);

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
      const data = await get<AvailableSeatsResponse>(
        `/trip/available-seats/${encodeURIComponent(tripId)}`,
        {
          query: {
            fromStopId,
            toStopId,
          },
        }
      );

      availableSeats.value = Array.isArray(data.seats) ? data.seats : [];
      return availableSeats.value;
    } catch (error) {
      console.error('fetchAvailableSeats error:', error);
      availableSeats.value = [];
      throw error;
    }
  };

  const fetchTrip = async (tripId: string) => {
    try {
      const data = await get<TripResponse>(
        `/trip/${encodeURIComponent(tripId)}`
      );
      selectedTrip.value = data.trip;
      return data.trip;
    } catch (error) {
      console.error('fetchTrip error:', error);
      throw error;
    }
  };

  const fetchTripDetails = async (
    tripId: string,
    fromStopId: string,
    toStopId: string
  ) => {
    try {
      const data = await get<TripResponse>(
        `/trip/trip-details/${encodeURIComponent(tripId)}`,
        {
          query: {
            fromStopId,
            toStopId,
          },
        }
      );

      selectedTrip.value = data.trip;
      return data.trip;
    } catch (error) {
      console.error('fetchTripDetails error:', error);
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
