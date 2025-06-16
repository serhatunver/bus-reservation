import { defineStore } from 'pinia';
import { ref } from 'vue';

const baseUrl = 'http://localhost:3000/api/user';
const { token } = useAuth();

export const useUserStore = defineStore('user', () => {
  const myReservations = ref([]);

  const fetchMyReservations = async () => {
    try {
      const response = await fetch(`${baseUrl}/my-reservations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token.value || '',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      myReservations.value = data.reservations;
      console.log('fetchMyReservations data:', data);
    } catch (error) {
      console.error('fetchMyReservations error:', error);
      throw error;
    }
  };

  const cancelMyReservation = async (pnr: string, email: string) => {
    try {
      const response = await fetch(`${baseUrl}/cancel-reservation`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token.value || '',
        },
        body: JSON.stringify({ pnr, email }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('cancelMyReservation data:', data);
      if (token.value) {
        // Only refresh if the user is authenticated
        await fetchMyReservations(); // Refresh reservations after cancellation
      }
      return data;
    } catch (error) {
      console.error('cancelMyReservation error:', error);
      throw error;
    }
  };

  return {
    myReservations,
    fetchMyReservations,
    cancelMyReservation,
  };
});
