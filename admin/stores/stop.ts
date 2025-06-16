import type { Stop } from '@/components/columns';
import { defineStore } from 'pinia';
import { ref } from 'vue';

const baseUrl = 'http://localhost:3000/api/stop';
const { token } = useAuth();

interface StopResponse {
  stops: Stop[];
}

export const useStopStore = defineStore('stop', () => {
  const stops = ref<Stop[]>([]);

  async function fetchStops(): Promise<StopResponse> {
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

      const stopResponse: StopResponse = await response.json();
      stops.value = stopResponse.stops;

      console.log('Fetched stops:', stopResponse);
      return stopResponse;
    } catch (error) {
      console.error('Error fetching stops:', error);
      throw error; // Re-throw the error for further handling if needed
    }
  }

  const addStop = async (newStopName: string) => {
    try {
      const response = await fetch(`${baseUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token.value || '',
        },
        body: JSON.stringify({ newStopName }),
      });

      if (!response.ok) {
        throw new Error('Failed to add stop');
      }

      const stopResponse = await fetchStops();
      console.log('Stop added successfully:', response);
      return stopResponse;
    } catch (error) {
      console.error('Error adding stop:', error);
    }
  };

  const deleteStop = async (stopId: string) => {
    try {
      const response = await fetch(`${baseUrl}/${stopId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token.value || '',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete stop');
      }

      const stopResponse = await fetchStops();
      console.log(`Stop with ID ${stopId} deleted successfully.`);
      return stopResponse;
    } catch (error) {
      console.error('Error deleting stop:', error);
    }
  };

  const updateStop = async (stopId: string, updatedStopName: string) => {
    try {
      const response = await fetch(`${baseUrl}/${stopId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token.value || '',
        },
        body: JSON.stringify({ updatedStopName }),
      });

      if (!response.ok) {
        throw new Error('Failed to edit stop');
      }

      const stopResponse = await fetchStops();
      console.log(`Stop with ID ${stopId} edited successfully.`);
      return stopResponse;
    } catch (error) {
      console.error('Error editing stop:', error);
    }
  };

  return {
    stops,
    fetchStops,
    addStop,
    deleteStop,
    updateStop,
  };
});
