import type { ObjectId } from '~/types/common';
import type { Stop } from '~/types/stop';
import type { Trip } from '~/types/trip';

export type ReservationStatus = 'booked' | 'cancelled' | 'completed';

export interface Reservation {
  _id: ObjectId;
  trip: ObjectId | Trip;
  pnr: string;
  seatNumber: number;
  fromStop: ObjectId | Stop;
  toStop: ObjectId | Stop;
  passengerName: string;
  passengerSurname: string;
  email: string;
  phone: string;
  price: number;
  status: ReservationStatus;
  passenger?: ObjectId;
  createdAt?: string;
  updatedAt?: string;
}

export interface MakeReservationPayload {
  tripId: string;
  fromStopId: string;
  toStopId: string;
  seatNumber: number;
  price: number;
  passengerName: string;
  passengerSurname: string;
  email: string;
  phone: string;
}

export interface ReservationResponse {
  reservation: Reservation;
}

export interface ReservationListResponse {
  reservations: Reservation[];
}

export interface ReservationActionResponse {
  message: string;
  reservation?: Reservation;
}
