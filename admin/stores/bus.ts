import type { Bus } from '@/components/columns';
import { defineStore } from 'pinia';
import { ref } from 'vue';

const baseUrl = 'http://localhost:3000/api/bus';
const { token } = useAuth();

interface BusResponse {
  buses: Bus[];
}

export const useBusStore = defineStore('bus', () => {
  const buses = ref<Bus[]>([]);

  async function fetchBuses(): Promise<BusResponse> {
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

      const busResponse: BusResponse = await response.json();
      buses.value = busResponse.buses;

      console.log('Fetched buses:', busResponse);
      return busResponse;
    } catch (error) {
      console.error('Error fetching buses:', error);
      throw error;
    }
  }

  const addBus = async (newStopName: string) => {
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
        throw new Error('Failed to add bus');
      }

      const busResponse = await fetchBuses();
      console.log('Bus added successfully:', response);
      return busResponse;
    } catch (error) {
      console.error('Error adding bus:', error);
    }
  };

  const deleteBus = async (busId: string) => {
    try {
      const response = await fetch(`${baseUrl}/${busId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token.value || '',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete bus');
      }

      const busResponse = await fetchBuses();
      console.log(`Bus with ID ${busId} deleted successfully.`);
      return busResponse;
    } catch (error) {
      console.error('Error deleting bus:', error);
    }
  };

  const updateBus = async (busId: string, updatedBus: string) => {
    try {
      const response = await fetch(`${baseUrl}/${busId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token.value || '',
        },
        body: JSON.stringify({ updatedBus }),
      });

      if (!response.ok) {
        throw new Error('Failed to edit bus');
      }

      const busResponse = await fetchBuses();
      console.log(`Bus with ID ${busId} edited successfully.`);
      return busResponse;
    } catch (error) {
      console.error('Error editing bus:', error);
    }
  };

  return {
    buses,
    fetchBuses,
    addBus,
    deleteBus,
    updateBus,
  };
});
