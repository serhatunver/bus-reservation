export function buildFreeRanges(reservedSegments, totalSegments) {
  if (!reservedSegments.length) return [{ start: 0, end: totalSegments }];

  reservedSegments.sort((a, b) => a.start - b.start);
  const free = [];

  if (reservedSegments[0].start > 0) {
    free.push({ start: 0, end: reservedSegments[0].start });
  }

  for (let i = 0; i < reservedSegments.length - 1; i++) {
    if (reservedSegments[i].end < reservedSegments[i + 1].start) {
      free.push({
        start: reservedSegments[i].end,
        end: reservedSegments[i + 1].start,
      });
    }
  }

  const last = reservedSegments[reservedSegments.length - 1];
  if (last.end < totalSegments) {
    free.push({ start: last.end, end: totalSegments });
  }

  return free;
}
