import type { ObjectId } from '~/types/common';

export interface BusSeat {
  seatNumber: number;
  row: number;
  column: number;
}

export interface Bus {
  _id: ObjectId;
  capacity: number;
  model: string;
  modelYear: number;
  plateNumber: string;
  trips?: ObjectId[];
  isActive: boolean;
  seats: BusSeat[];
  createdAt?: string;
  updatedAt?: string;
}
