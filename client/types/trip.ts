import type { ObjectId } from '~/types/common';
import type { Stop } from '~/types/stop';
import type { Bus } from '~/types/bus';

export interface TripRouteItem {
  from: ObjectId | Stop;
  to: ObjectId | Stop;
  price: number;
  duration: number;
}

export interface Trip {
  _id: ObjectId;
  name: string;
  route: TripRouteItem[];
  departureTime: string;
  arrivalTime: string;
  bus: ObjectId | Bus;
  createdAt?: string;
  updatedAt?: string;
}

export interface SearchTripResponse {
  trips: Trip[];
  fromStop: Stop;
  toStop: Stop;
}

export interface TripResponse {
  trip: Trip;
}

export interface AvailableSeatsResponse {
  seats:
    | number[]
    | {
        seatNumber: number;
        isAvailable?: boolean;
        gender?: string | null;
      }[];
}
