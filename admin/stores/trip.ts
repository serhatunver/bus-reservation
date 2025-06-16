import type { Trip } from '@/components/columns';
import { defineStore } from 'pinia';
import { ref } from 'vue';

const baseUrl = 'http://localhost:3000/api/trip';
const { token } = useAuth();

type TripResponse = Trip[];

export const useTripStore = defineStore('trip', () => {
  const trips = ref<Trip[]>([]);

  async function fetchTrips(): Promise<TripResponse> {
    try {
      const response = await fetch(`${baseUrl}/all`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token.value || '',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const tripResponse: TripResponse = await response.json();
      trips.value = tripResponse;

      console.log('Fetched trips:', tripResponse);
      return tripResponse;
    } catch (error) {
      console.error('Error fetching trips:', error);
      throw error;
    }
  }

  const addTrip = async (newTripName: string) => {
    try {
      const response = await fetch(`${baseUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token.value || '',
        },
        body: JSON.stringify({ newTripName }),
      });

      if (!response.ok) {
        throw new Error('Failed to add trip');
      }

      const tripResponse = await fetchTrips();
      console.log('Trip added successfully:', response);
      return tripResponse;
    } catch (error) {
      console.error('Error adding trip:', error);
    }
  };

  const deleteTrip = async (tripId: string) => {
    try {
      const response = await fetch(`${baseUrl}/${tripId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token.value || '',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete trip');
      }

      const tripResponse = await fetchTrips();
      console.log(`Trip with ID ${tripId} deleted successfully.`);
      return tripResponse;
    } catch (error) {
      console.error('Error deleting trip:', error);
    }
  };

  const updateTrip = async (tripId: string, updatedTripName: string) => {
    try {
      const response = await fetch(`${baseUrl}/${tripId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token.value || '',
        },
        body: JSON.stringify({ updatedTripName }),
      });

      if (!response.ok) {
        throw new Error('Failed to edit trip');
      }

      const tripResponse = await fetchTrips();
      console.log(`Trip with ID ${tripId} edited successfully.`);
      return tripResponse;
    } catch (error) {
      console.error('Error editing trip:', error);
    }
  };

  return {
    trips,
    fetchTrips,
    addTrip,
    deleteTrip,
    updateTrip,
  };
});
