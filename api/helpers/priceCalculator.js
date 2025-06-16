export function calculatePrice(pricing, from, to, priority, maxPriority) {
  const stopOrder = Array.from(
    new Set([
      ...pricing.map((p) => p.from.toString()),
      ...pricing.map((p) => p.to.toString()),
    ])
  );

  const fromIndex = stopOrder.indexOf(from.toString());
  const toIndex = stopOrder.indexOf(to.toString());

  if (fromIndex === -1 || toIndex === -1 || fromIndex >= toIndex)
    throw new Error('Invalid stop selection');

  const relevant = pricing.filter((p) => {
    const pFromIndex = stopOrder.indexOf(p.from.toString());
    const pToIndex = stopOrder.indexOf(p.to.toString());
    return pFromIndex >= fromIndex && pToIndex <= toIndex;
  });

  // Calculate the base price by summing the prices of all relevant segments
  const basePrice = relevant.reduce((sum, segment) => sum + segment.price, 0);

  // Calculate the price multiplier based on priority
  const priceMultiplier =
    maxPriority === 1 ? 1 : 1 + (priority - 1) / (maxPriority - 1); // If maxPriority is 1, no multiplier is applied
  return Math.ceil(basePrice * priceMultiplier);
}
