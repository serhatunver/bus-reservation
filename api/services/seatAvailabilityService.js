import Trip from '../models/trip.model.js';
import Reservation from '../models/reservation.model.js';
import { buildFreeRanges } from '../helpers/rangeBuilder.js';
import { calculatePrice } from '../helpers/priceCalculator.js';

export async function getAvailableSeatsOrdered(tripId, fromStopId, toStopId) {
  const trip = await Trip.findById(tripId).populate('route bus').lean();

  if (!trip) throw new Error('Trip not found');

  const stopIds = [];

  for (const segment of trip.route) {
    const fromId = segment.from.toString();
    const toId = segment.to.toString();

    if (!stopIds.includes(fromId)) stopIds.push(fromId);
    if (!stopIds.includes(toId)) stopIds.push(toId);
  }

  const totalSegments = stopIds.length - 1;

  const stopIndexMap = new Map(stopIds.map((id, idx) => [id, idx]));

  const fromIndex = stopIndexMap.get(fromStopId.toString());
  const toIndex = stopIndexMap.get(toStopId.toString());

  if (
    fromIndex === undefined ||
    toIndex === undefined ||
    fromIndex >= toIndex
  ) {
    throw new Error('Invalid stop selection');
  }

  const reservations = await Reservation.find(
    { trip: tripId },
    'seatNumber fromStop toStop'
  ).lean();

  const reservationsBySeat = Array.from(
    { length: trip.bus.seats.length + 1 },
    () => []
  );

  for (const res of reservations) {
    const seat = res.seatNumber;
    const start = stopIndexMap.get(res.fromStop.toString());
    const end = stopIndexMap.get(res.toStop.toString());
    if (start === undefined || end === undefined) continue;

    reservationsBySeat[seat].push({ start, end });
  }

  const availableSeatsWithExtra = [];
  let maxPriority = 0;

  for (let seatNumber = 1; seatNumber <= trip.bus.seats.length; seatNumber++) {
    const seatReservations = reservationsBySeat[seatNumber];

    let hasConflict = false;
    for (const res of seatReservations) {
      if (!(toIndex <= res.start || fromIndex >= res.end)) {
        hasConflict = true;
        break;
      }
    }
    if (hasConflict) continue;

    const freeRanges = buildFreeRanges(seatReservations, totalSegments);
    const requestedLength = toIndex - fromIndex;
    let minCoverLength = Infinity;

    for (const range of freeRanges) {
      const { start, end } = range;
      if (fromIndex >= start && toIndex <= end) {
        const gapLength = end - start;
        minCoverLength = Math.min(minCoverLength, gapLength);
      }
    }

    if (minCoverLength === Infinity) continue;

    const extra = minCoverLength - requestedLength;

    availableSeatsWithExtra.push({
      seatNumber,
      extra,
    });
  }

  if (availableSeatsWithExtra.length === 0) {
    return [];
  }

  // Find the minimum extra space available across all seats
  const minExtra = Math.min(...availableSeatsWithExtra.map((s) => s.extra));

  // Map available seats to their priority and initial price
  const seatsWithPrice = availableSeatsWithExtra.map((seatInfo) => {
    const priority = seatInfo.extra - minExtra + 1;

    // Update maxPriority if this seat's priority is higher
    if (priority > maxPriority) {
      maxPriority = priority;
    }

    return {
      seatNumber: seatInfo.seatNumber,
      priority,
      price: 0, // Price will be calculated later
    };
  });

  // Now that we know maxPriority, we can calculate the prices
  const finalSeats = seatsWithPrice.map((seat) => ({
    ...seat,
    price: calculatePrice(
      trip.route,
      fromStopId,
      toStopId,
      seat.priority,
      maxPriority
    ),
  }));

  return finalSeats.sort((a, b) => a.priority - b.priority);
}
