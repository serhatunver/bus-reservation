import { defineStore } from 'pinia';

const baseUrl = 'http://localhost:3000/api/reservation';
const { token } = useAuth();

export const useReservationStore = defineStore('reservation', () => {
  const makeReservation = async ({
    tripId,
    fromStopId,
    toStopId,
    seatNumber,
    price,
    passengerName,
    passengerSurname,
    email,
    phone,
  }: {
    tripId: string;
    fromStopId: string;
    toStopId: string;
    seatNumber: number;
    price: number;
    passengerName: string;
    passengerSurname: string;
    email: string;
    phone: string;
  }) => {
    try {
      const response = await fetch(`${baseUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token.value || '',
        },
        body: JSON.stringify({
          tripId,
          fromStopId,
          toStopId,
          seatNumber,
          price,
          passengerName,
          passengerSurname,
          email,
          phone,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Reservation successful:', data);
      return data;
    } catch (error) {
      console.error('makeReservation error:', error);
      throw error;
    }
  };

  const fetchReservationDetails = async (pnr: string, email: string) => {
    try {
      const response = await fetch(`${baseUrl}/pnr/${pnr}/email/${email}`, {
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

      // Assuming the response contains reservation details
      if (!data || !data.reservation) {
        throw new Error('No reservation found for the provided PNR and email');
      }

      return data.reservation;
    } catch (error) {
      console.error('fetchReservationDetails error:', error);
      throw error;
    }
  };
  const fetchReservationDetailsByPnr = async (pnr: string) => {
    try {
      const response = await fetch(`${baseUrl}/pnr/${pnr}`, {
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

      // Assuming the response contains reservation details
      if (!data || !data.reservation) {
        throw new Error('No reservation found for the provided PNR and email');
      }

      return data.reservation;
    } catch (error) {
      console.error('fetchReservationDetails error:', error);
      throw error;
    }
  };

  const cancelReservation = async (pnr: string, email: string) => {
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
      console.log('Reservation cancelled successfully:', data);
      return data;
    } catch (error) {
      console.error('cancelReservation error:', error);
      throw error;
    }
  };

  return {
    makeReservation,
    fetchReservationDetails,
    fetchReservationDetailsByPnr,
    cancelReservation,
  };
});
