"use client";

import { useState } from "react";
import Link from "next/link";
import { heroes } from "@/data/heroes";
import { HeroCard } from "./HeroCard";
import { Divider } from "./Divider";
import { useOwnedHeroes, BASE_OWNED } from "@/hooks/useOwnedHeroes";
import { Search, X } from "lucide-react";

const FILTERS = ["All", "Owned", "Gacha", "Support", "Fighter", "Archer", "Tanker"] as const;
type Filter = typeof FILTERS[number];

export function HeroRoster() {
  const [filter, setFilter]   = useState<Filter>("All");
  const [search, setSearch]   = useState("");
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const { isOwned, addOwned, removeOwned, mounted } = useOwnedHeroes();

  function handleAdd(heroId: string) {
    addOwned(heroId);
    setJustAdded(heroId);
    setTimeout(() => setJustAdded(null), 1200);
  }

  const filtered = heroes.filter((h) => {
    const matchSearch = h.name.toLowerCase().includes(search.toLowerCase()) ||
                        h.role.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (filter === "All") return true;
    if (filter === "Owned") return isOwned(h.id);
    if (filter === "Gacha") return !isOwned(h.id);
    return h.type === filter;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="text-center mb-4">
        <p className="text-xs text-ink-muted uppercase tracking-widest mb-2 font-serif">
          Rellion — Hero Collection
        </p>
        <h1 className="font-serif text-2xl md:text-3xl text-ink">Roster & Skills</h1>
        <p className="text-ink-muted italic font-[var(--font-fell)] text-sm mt-1">
          Tap hero untuk lihat detail
        </p>
      </div>

      <Divider />

      {/* Search + filters */}
      <div className="mt-5 mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative w-full sm:w-64 flex-shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-muted" />
          <input
            type="text"
            placeholder="Cari hero atau role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-4 py-2 text-sm font-[var(--font-fell)] bg-parchment border border-parchment-dark rounded-lg text-ink placeholder:text-stone focus:outline-none focus:border-sage/60 transition-colors"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`
                font-serif text-xs tracking-wider px-3 py-1.5 rounded-full border transition-all
                ${filter === f
                  ? "border-sage bg-sage/10 text-sage"
                  : "border-parchment-dark text-ink-muted hover:border-sage/50 hover:text-ink-soft"}
              `}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Hero grid */}
      <div>
        {!mounted ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 rounded-xl border border-parchment-dark bg-parchment animate-pulse" />
            ))}
          </div>
        ) : (() => {
          const ownedList  = filtered.filter((h) => isOwned(h.id));
          const gachaList  = filtered.filter((h) => !isOwned(h.id));
          const showBoth   = ownedList.length > 0 && gachaList.length > 0;

          function renderCard(hero: typeof filtered[0], index: number) {
            const owned   = isOwned(hero.id);
            const isBase  = BASE_OWNED.has(hero.id);
            return (
              <div
                key={hero.id}
                className="group flex flex-col h-full relative animate-fade-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {justAdded === hero.id && (
                  <div className="obtained-flash absolute inset-0 z-20 flex items-center justify-center pointer-events-none rounded-xl">
                    <span className="font-serif text-sm text-sage bg-parchment/95 border border-sage/50 px-4 py-2 rounded-lg shadow-lg">
                      ✦ Dimiliki!
                    </span>
                  </div>
                )}
                <Link href={`/hero/${hero.id}`} className="block flex-1 min-h-0">
                  <HeroCard
                    hero={hero}
                    expanded
                    owned={owned}
                    isBase={isBase}
                    onAdd={() => handleAdd(hero.id)}
                  />
                </Link>
                <button
                  onClick={(e) => { e.preventDefault(); removeOwned(hero.id); }}
                  className={`transition-opacity flex items-center justify-center gap-1 text-[10px] font-serif text-white bg-rose/70 hover:bg-rose py-1.5 rounded-b-xl -mt-px ${
                    owned ? "opacity-0 group-hover:opacity-100" : "invisible pointer-events-none"
                  }`}
                >
                  <X className="w-3 h-3" /> Hapus dari koleksi
                </button>
              </div>
            );
          }

          return (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-stretch">
                {ownedList.map((hero, i) => renderCard(hero, i))}
              </div>

              {showBoth && (
                <div className="flex items-center gap-3 mt-6 mb-5">
                  <div className="flex-1 h-px bg-parchment-dark" />
                  <span className="text-xs text-stone font-serif tracking-widest">✦ BELUM DIMILIKI ✦</span>
                  <div className="flex-1 h-px bg-parchment-dark" />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-stretch">
                {gachaList.map((hero, i) => renderCard(hero, ownedList.length + i))}
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
}
