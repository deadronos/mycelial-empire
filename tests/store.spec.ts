import { beforeEach, describe, expect, it } from 'vitest';

import { useGameStore } from '../src/store/gameStore';

function resetStore() {
  const store = useGameStore.getState();
  store.resetNetwork(0);
  useGameStore.setState({ purchasedUpgrades: [], events: [], prestigeLevel: 0 });
}

describe('useGameStore actions', () => {
  beforeEach(() => {
    resetStore();
  });

  it('addEvent keeps newest at front and caps at 7', () => {
    const store = useGameStore.getState();
    for (let i = 0; i < 10; i++) {
      store.addEvent(`msg-${i}`);
    }
    const events = useGameStore.getState().events;
    expect(events.length).toBeLessThanOrEqual(7);
    expect(events[0]).toBe('msg-9');
  });

  it('resetNetwork sets spores and resets generatedNodes', () => {
    const store = useGameStore.getState();
    store.resetNetwork(5);
    expect(useGameStore.getState().resources.spores).toBe(5);
    expect(useGameStore.getState().generatedNodes).toBe(0);
  });

  it('explore fails when not enough sugar', () => {
    useGameStore.setState({ resources: { ...useGameStore.getState().resources, sugar: 0 } });
    const before = useGameStore.getState().nodes.length;
    useGameStore.getState().explore();
    expect(useGameStore.getState().nodes.length).toBe(before);
    expect(useGameStore.getState().events[0]).toContain('Not enough sugar to explore');
  });

  it('explore discovers an existing undiscovered node and spends sugar', () => {
    const store = useGameStore.getState();
    // Ensure there's an undiscovered node present in initial data
    const ancient = store.nodes.find((n) => n.id === 'ancient-root');
    expect(ancient).toBeDefined();
    expect(ancient?.discovered).toBe(false);

    // Give lots of sugar
    useGameStore.setState({ resources: { ...useGameStore.getState().resources, sugar: 1000 } });
    const beforeSugar = useGameStore.getState().resources.sugar;

    store.explore();

    const after = useGameStore.getState();
    const discovered = after.nodes.find((n) => n.id === 'ancient-root');
    expect(discovered?.discovered).toBe(true);
    // default explore cost is 120
    expect(after.resources.sugar).toBe(beforeSugar - 120);
  });

  it('upgrade reports when insufficient sugar and upgrades when enough', () => {
    useGameStore.setState({ resources: { ...useGameStore.getState().resources, sugar: 0 } });
    useGameStore.getState().upgrade();
    expect(useGameStore.getState().events[0]).toContain('Insufficient sugar');

    // Give sugar and upgrade
    useGameStore.setState({ resources: { ...useGameStore.getState().resources, sugar: 1000 } });
    const candidate = useGameStore.getState().nodes.find((n) => n.type === 'water' && n.discovered);
    expect(candidate).toBeDefined();
    const prevLevel = candidate!.upgradeLevel;

    useGameStore.getState().upgrade();

    const updated = useGameStore.getState().nodes.find((n) => n.id === candidate!.id);
    expect(updated!.upgradeLevel).toBe(prevLevel + 1);
  });

  it('purchaseUpgrade checks spores and purchases when available', () => {
    useGameStore.setState({ resources: { ...useGameStore.getState().resources, spores: 0 } });
    useGameStore.getState().purchaseUpgrade('rich-mycelium');
    expect(useGameStore.getState().events[0]).toContain('Not enough spores');

    useGameStore.setState({ resources: { ...useGameStore.getState().resources, spores: 10 } });
    useGameStore.getState().purchaseUpgrade('rich-mycelium');
    expect(useGameStore.getState().purchasedUpgrades).toContain('rich-mycelium');
    const remaining = useGameStore.getState().resources.spores;
    expect(remaining).toBeLessThanOrEqual(10);
  });

  it('tick updates edges strain and flow/pulse numbers', () => {
    useGameStore.getState().tick();
    const after = useGameStore.getState();
    expect(typeof after.flowRate).toBe('number');
    expect(typeof after.pulse).toBe('number');
    const afterStrains = after.edges.map((e) => e.strain);
    // At least one edge strain should be a number (and non-negative)
    expect(afterStrains.some((s) => typeof s === 'number' && s >= 0)).toBe(true);
  });

  it('explore spawns a new dynamic node when all nodes discovered', () => {
    // Mark all nodes discovered so explore will spawn a new dynamic pocket
    useGameStore.setState({ nodes: useGameStore.getState().nodes.map((n) => ({ ...n, discovered: true })) });
    useGameStore.setState({ resources: { ...useGameStore.getState().resources, sugar: 1000 } });
    const beforeGenerated = useGameStore.getState().generatedNodes;
    const beforeNodeCount = useGameStore.getState().nodes.length;
    const beforeEdgeCount = useGameStore.getState().edges.length;

    useGameStore.getState().explore();

    const after = useGameStore.getState();
    expect(after.generatedNodes).toBe(beforeGenerated + 1);
    expect(after.nodes.length).toBe(beforeNodeCount + 1);
    expect(after.edges.length).toBe(beforeEdgeCount + 1);
    expect(after.events[0]).toContain('New pocket uncovered');
  });

  it('reinforce strengthens highest-strain edge when enough sugar', () => {
    // Ensure an edge has strain and we have sugar
    const e = useGameStore.getState().edges[0];
    useGameStore.setState({ edges: [{ ...e, strain: 1 }, ...useGameStore.getState().edges.slice(1)] });
    useGameStore.setState({ resources: { ...useGameStore.getState().resources, sugar: 1000 } });

    const beforeCapacity = useGameStore.getState().edges[0].capacity;
    useGameStore.getState().reinforce();
    const after = useGameStore.getState();
    expect(after.edges[0].capacity).toBeGreaterThanOrEqual(beforeCapacity + 6);
    expect(after.edges[0].reinforced).toBe(true);
    expect(after.events[0]).toContain('Hyphae thickened');
  });

  it('purify requires proper resources and purifies toxic node', () => {
    // Find toxic node and mark discovered
    useGameStore.setState({ nodes: useGameStore.getState().nodes.map((n) => (n.type === 'toxic' ? { ...n, discovered: true, purified: false } : n)) });
    useGameStore.setState({ resources: { ...useGameStore.getState().resources, sugar: 200, spores: 2 } });

    useGameStore.getState().purify();

    const toxic = useGameStore.getState().nodes.find((n) => n.type === 'toxic');
    expect(toxic?.purified).toBe(true);
    expect(useGameStore.getState().resources.sugar).toBeLessThanOrEqual(90); // spent 110 from 200
    expect(useGameStore.getState().resources.spores).toBeGreaterThanOrEqual(0);
    expect(useGameStore.getState().events[0]).toContain('neutralized');
  });

  it('purchaseUpgrade shows message when already purchased', () => {
    useGameStore.setState({ resources: { ...useGameStore.getState().resources, spores: 10 }, purchasedUpgrades: ['rich-mycelium'] });
    useGameStore.getState().purchaseUpgrade('rich-mycelium');
    expect(useGameStore.getState().events[0]).toContain('already woven');
  });

  it('upgrade reports when no candidate available', () => {
    // Set all nodes to maxed upgradeLevel
    useGameStore.setState({ nodes: useGameStore.getState().nodes.map((n) => ({ ...n, discovered: true, upgradeLevel: 3 })) });
    useGameStore.setState({ resources: { ...useGameStore.getState().resources, sugar: 1000 } });
    useGameStore.getState().upgrade();
    expect(useGameStore.getState().events[0]).toContain('All resource pockets are tuned to their limit');
  });

  it('tick performs resource conversion when water and carbon are available', () => {
    useGameStore.setState({ resources: { ...useGameStore.getState().resources, water: 1000, carbon: 1000 } });
    const beforeSugar = useGameStore.getState().resources.sugar;
    useGameStore.getState().tick();
    const afterSugar = useGameStore.getState().resources.sugar;
    expect(afterSugar).toBeGreaterThanOrEqual(beforeSugar);
  });

  it('prestige increases prestigeLevel and resets the network when requirements are met', () => {
    // Ensure enough discovered nodes and sugar
    useGameStore.setState({ nodes: useGameStore.getState().nodes.map((n) => ({ ...n, discovered: true })), resources: { ...useGameStore.getState().resources, sugar: 1000 } });
    const beforeLevel = useGameStore.getState().prestigeLevel;
    useGameStore.getState().prestige();
    const after = useGameStore.getState();
    expect(after.prestigeLevel).toBe(beforeLevel + 1);
    expect(after.events[0]).toContain('Fruiting body rises');
  });
});
