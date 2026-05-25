"use client";

import { useState, useEffect } from "react";
import { heroes } from "@/data/heroes";

const STORAGE_KEY         = "rellion_owned_heroes";
const STORAGE_REMOVED_KEY = "rellion_removed_heroes";

export const BASE_OWNED = new Set(
  heroes.filter((h) => h.rarity === "owned").map((h) => h.id)
);

export function useOwnedHeroes() {
  const [extraOwned,  setExtraOwned]  = useState<Set<string>>(new Set());
  const [removedBase, setRemovedBase] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored  = localStorage.getItem(STORAGE_KEY);
      if (stored)  setExtraOwned(new Set(JSON.parse(stored)  as string[]));

      const removed = localStorage.getItem(STORAGE_REMOVED_KEY);
      if (removed) setRemovedBase(new Set(JSON.parse(removed) as string[]));
    } catch {}
    setMounted(true);
  }, []);

  function isOwned(heroId: string): boolean {
    if (removedBase.has(heroId)) return false;
    return BASE_OWNED.has(heroId) || extraOwned.has(heroId);
  }

  function addOwned(heroId: string) {
    if (BASE_OWNED.has(heroId)) {
      // Kembalikan base hero yang pernah dihapus
      setRemovedBase((prev) => {
        const next = new Set(prev);
        next.delete(heroId);
        localStorage.setItem(STORAGE_REMOVED_KEY, JSON.stringify([...next]));
        return next;
      });
      return;
    }
    setExtraOwned((prev) => {
      const next = new Set(prev);
      next.add(heroId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  }

  function removeOwned(heroId: string) {
    if (BASE_OWNED.has(heroId)) {
      setRemovedBase((prev) => {
        const next = new Set(prev);
        next.add(heroId);
        localStorage.setItem(STORAGE_REMOVED_KEY, JSON.stringify([...next]));
        return next;
      });
      return;
    }
    setExtraOwned((prev) => {
      const next = new Set(prev);
      next.delete(heroId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  }

  return { isOwned, addOwned, removeOwned, mounted };
}
