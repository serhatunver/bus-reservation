import type { Reservation } from '@/components/columns';
import { defineStore } from 'pinia';
import { ref } from 'vue';

const baseUrl = 'http://localhost:3000/api/reservation';
const { token } = useAuth();

interface ReservationResponse {
  reservations: Reservation[];
}

export const useReservationStore = defineStore('reservation', () => {
  const reservations = ref<Reservation[]>([]);

  async function fetchReservations(): Promise<ReservationResponse> {
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

      const reservationResponse: ReservationResponse = await response.json();
      reservations.value = reservationResponse.reservations;

      console.log('Fetched reservations:', reservationResponse);
      return reservationResponse;
    } catch (error) {
      console.error('Error fetching reservations:', error);
      throw error; // Re-throw the error for further handling if needed
    }
  }

  const addReservation = async (newReservationName: string) => {
    try {
      const response = await fetch(`${baseUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token.value || '',
        },
        body: JSON.stringify({ newReservationName }),
      });

      if (!response.ok) {
        throw new Error('Failed to add reservation');
      }

      const reservationResponse = await fetchReservations();
      console.log('Reservation added successfully:', response);
      return reservationResponse;
    } catch (error) {
      console.error('Error adding reservation:', error);
    }
  };

  const deleteReservation = async (reservationId: string) => {
    try {
      const response = await fetch(`${baseUrl}/${reservationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token.value || '',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete reservation');
      }

      const reservationResponse = await fetchReservations();
      console.log(`Reservation with ID ${reservationId} deleted successfully.`);
      return reservationResponse;
    } catch (error) {
      console.error('Error deleting reservation:', error);
    }
  };

  const updateReservation = async (
    reservationId: string,
    updatedReservationName: string
  ) => {
    try {
      const response = await fetch(`${baseUrl}/${reservationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token.value || '',
        },
        body: JSON.stringify({ updatedReservationName }),
      });

      if (!response.ok) {
        throw new Error('Failed to edit reservation');
      }

      const reservationResponse = await fetchReservations();
      console.log(`Reservation with ID ${reservationId} edited successfully.`);
      return reservationResponse;
    } catch (error) {
      console.error('Error editing reservation:', error);
    }
  };

  return {
    reservations,
    fetchReservations,
    addReservation,
    deleteReservation,
    updateReservation,
  };
});
