import { Hero } from "@/types";
import { analyzeSynergies, SynergyAnalysis } from "./synergy";

export interface RecommendedLineup {
  front: Hero[];
  mid: Hero[];
  back: Hero[];
  allIds: string[];
  score: number;
  rating: SynergyAnalysis["rating"];
  activeSynergies: SynergyAnalysis["activeSynergies"];
}

function combos<T>(arr: T[], k: number): T[][] {
  if (k === 0) return [[]];
  if (arr.length < k) return [];
  const [head, ...tail] = arr;
  return [
    ...combos(tail, k - 1).map((c) => [head, ...c]),
    ...combos(tail, k),
  ];
}

export function recommendLineups(pool: Hero[], maxResults = 3): RecommendedLineup[] {
  const frontPool = pool.filter((h) => h.position === "front");
  const midPool   = pool.filter((h) => h.position === "mid");
  const backPool  = pool.filter((h) => h.position === "back");

  const frontSlots = Math.min(2, frontPool.length);
  const midSlots   = Math.min(2, midPool.length);

  if (frontSlots === 0 || midSlots === 0 || backPool.length === 0) return [];

  const results: RecommendedLineup[] = [];

  for (const fc of combos(frontPool, frontSlots)) {
    for (const mc of combos(midPool, midSlots)) {
      for (const bc of backPool) {
        const allIds = [...fc, ...mc, bc].map((h) => h.id);
        const { score, rating, activeSynergies } = analyzeSynergies(allIds);
        results.push({ front: fc, mid: mc, back: [bc], allIds, score, rating, activeSynergies });
      }
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, maxResults);
}
