import { defineStore } from 'pinia';
import { ref } from 'vue';
import type {
  Reservation,
  ReservationActionResponse,
  ReservationListResponse,
} from '~/types/reservation';

export const useUserStore = defineStore('user', () => {
  const { get, put } = useApi();
  const { token } = useAuth();

  const myReservations = ref<Reservation[]>([]);

  const fetchMyReservations = async (): Promise<Reservation[]> => {
    const data = await get<ReservationListResponse>('/user/my-reservations');
    myReservations.value = data.reservations ?? [];
    return myReservations.value;
  };

  const cancelMyReservation = async (
    pnr: string,
    email: string
  ): Promise<ReservationActionResponse> => {
    const data = await put<ReservationActionResponse>(
      '/user/cancel-reservation',
      { pnr, email }
    );

    if (token.value) {
      await fetchMyReservations();
    }

    return data;
  };

  return {
    myReservations,
    fetchMyReservations,
    cancelMyReservation,
  };
});
