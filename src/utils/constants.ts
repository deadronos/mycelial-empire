/**
 * Game simulation and balance constants.
 */

/** The interval between game ticks in milliseconds. */
export const TICK_RATE = 1200;

/** Base costs for various player actions. */
export const COSTS = {
  EXPLORE: 120,
  UPGRADE: 90,
  REINFORCE: 70,
  PURIFY: 110,
  PRESTIGE_SUGAR: 380,
  PRESTIGE_NODES: 6,
};

/** Scaling factors for costs as the empire grows. */
export const SCALING = {
  EXPLORE_EXPONENT: 1.12,
  UPGRADE_EXPONENT: 1.45,
};

/** Conversion rates for resource processing nodes. */
export const CONVERSION = {
  POTENTIAL_FACTOR: 0.08,
  MAX_PER_NODE: 6,
  RESOURCE_CONSUMPTION: 0.65,
  BASE_SUGAR_YIELD: 1.35,
  NODE_BONUS: 0.1,
};

/** Maintenance and strain constants. */
export const MAINTENANCE = {
  EDGE_BASE_COST: 0.35,
  PRESTIGE_DISCOUNT: 0.9,
  MAX_STRAIN: 1.6,
  TOXIC_STRAIN: 0.5,
};

/** Prestige and reward constants. */
export const REWARDS = {
  SPORE_GAIN_NODE_FACTOR: 0.9,
  SPORE_GAIN_FLOW_FACTOR: 0.8,
  SPORE_GAIN_SUGAR_DIVISOR: 90,
  MIN_SPORE_GAIN: 2,
};
