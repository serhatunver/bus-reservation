import { defineStore } from 'pinia';
import type {
  MakeReservationPayload,
  Reservation,
  ReservationActionResponse,
  ReservationResponse,
} from '~/types/reservation';

export const useReservationStore = defineStore('reservation', () => {
  const { get, post, put } = useApi();

  const makeReservation = async (
    payload: MakeReservationPayload
  ): Promise<ReservationActionResponse> => {
    return await post<ReservationActionResponse>('/reservation', payload);
  };

  const fetchReservationDetails = async (
    pnr: string,
    email: string
  ): Promise<Reservation> => {
    const data = await get<ReservationResponse>(
      `/reservation/pnr/${encodeURIComponent(pnr)}/email/${encodeURIComponent(email)}`
    );

    if (!data?.reservation) {
      throw new Error('No reservation found for the provided PNR and email');
    }

    return data.reservation;
  };

  const fetchReservationDetailsByPnr = async (
    pnr: string
  ): Promise<Reservation> => {
    const data = await get<ReservationResponse>(
      `/reservation/pnr/${encodeURIComponent(pnr)}`
    );

    if (!data?.reservation) {
      throw new Error('No reservation found for the provided PNR');
    }

    return data.reservation;
  };

  const cancelReservation = async (
    pnr: string,
    email: string
  ): Promise<ReservationActionResponse> => {
    return await put<ReservationActionResponse>(
      '/reservation/cancel-reservation',
      { pnr, email }
    );
  };

  return {
    makeReservation,
    fetchReservationDetails,
    fetchReservationDetailsByPnr,
    cancelReservation,
  };
});
