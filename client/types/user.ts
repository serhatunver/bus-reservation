import type { ObjectId } from '~/types/common';
import type { Reservation } from '~/types/reservation';

export type UserRole = 'admin' | 'user';

export interface User {
  _id: ObjectId;
  name: string;
  surname: string;
  email: string;
  phone: string;
  role: UserRole;
  reservations?: Array<ObjectId | Reservation>;
  createdAt?: string;
  updatedAt?: string;
}
