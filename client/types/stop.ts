import type { ObjectId } from '~/types/common';

export interface Stop {
  _id: ObjectId;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StopSearchResponse {
  stops: Stop[];
}
