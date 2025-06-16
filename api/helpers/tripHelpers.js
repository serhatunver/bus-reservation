// utils/tripHelpers.js
import { getAvailableSeatsOrdered } from '../services/seatAvailabilityService.js';

/**
 * Enriches trip details for a specific segment between origin and destination stops.
 * @param {Object} trip - The MongoDB Trip document (should be lean() to avoid re-hydration issues).
 * @param {string} fromStopId - The ID of the origin stop.
 * @param {string} toStopId - The ID of the destination stop.
 * @param {Object} fromStop - The MongoDB Stop document for the origin (should be lean()).
 * @param {Object} toStop - The MongoDB Stop document for the destination (should be lean()).
 * @returns {Promise<Object>} A promise that resolves to the enriched trip object.
 * @throws {Error} If selected stops are not found in the trip's route.
 */
export async function enrichTripDetails(
  trip,
  fromStopId,
  toStopId,
  fromStop,
  toStop
) {
  // Find the indices of the 'from' and 'to' stops within the trip's route array.
  const fromIndex = trip.route.findIndex((r) => r.from._id.equals(fromStopId));
  const toIndex = trip.route.findIndex((r) => r.to._id.equals(toStopId));

  // Validate if both stops exist in the route. The order (fromIndex <= toIndex)
  // should ideally be checked before calling this helper in the route handler.
  if (fromIndex === -1 || toIndex === -1) {
    throw new Error('Selected stops are not valid for this trip route.');
  }

  // Fetch available seat information for the specified segment of the trip.
  const availableSeats = await getAvailableSeatsOrdered(
    trip._id,
    fromStopId,
    toStopId
  );

  // Calculate the actual departure and arrival times for the segment.
  const departureDate = new Date(trip.departureTime);

  // Sum up durations (in minutes) for legs from the start of the trip up to the 'from' stop.
  const durationBeforeFrom = trip.route
    .slice(0, fromIndex)
    .reduce((sum, leg) => sum + (leg.duration || 0), 0);

  // Sum up durations (in minutes) for legs from the start of the trip up to and including the 'to' stop.
  const durationBeforeTo = trip.route
    .slice(0, toIndex + 1)
    .reduce((sum, leg) => sum + (leg.duration || 0), 0);

  // Calculate the precise departure time from the 'from' stop.
  const fromStopDepartureTime = new Date(
    departureDate.getTime() + durationBeforeFrom * 60000
  );

  // Calculate the precise arrival time at the 'to' stop.
  const toStopArrivalTime = new Date(
    departureDate.getTime() + durationBeforeTo * 60000
  );

  // Return the original trip object augmented with new, calculated details.
  return {
    ...trip,
    availableSeats,
    lowestPrice:
      availableSeats.length > 0
        ? Math.min(...availableSeats.map((s) => s.price)) // Find the minimum price among available seats
        : null, // If no seats, lowest price is null
    fromStopName: fromStop.name,
    toStopName: toStop.name,
    fromStopDepartureTime,
    toStopArrivalTime,
    // Calculate the total travel duration specifically between the 'from' and 'to' stops in minutes.
    durationBetweenStops: (toStopArrivalTime - fromStopDepartureTime) / 60000,
  };
}
