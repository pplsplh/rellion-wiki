"use client";

import { useState, useEffect } from "react";
import { heroes } from "@/data/heroes";
import { HeroAvatar } from "./HeroAvatar";

const TIERS = ["S", "A", "B", "C"] as const;
type Tier = typeof TIERS[number];

const TIER_META: Record<Tier, { label: string; color: string; bg: string; border: string }> = {
  S: { label: "S", color: "text-gold",   bg: "bg-gold/10",  border: "border-gold/50"  },
  A: { label: "A", color: "text-rose",   bg: "bg-rose/10",  border: "border-rose/50"  },
  B: { label: "B", color: "text-sage",   bg: "bg-sage/10",  border: "border-sage/50"  },
  C: { label: "C", color: "text-frost",  bg: "bg-frost/10", border: "border-frost/50" },
};

// Default tier berdasarkan analisis meta sendiri (bukan dari gambar tierlist)
const DEFAULT_ASSIGNMENTS: Record<string, Tier> = {
  // S — wajib semua formasi, force multiplier, main tank terbaik
  sera:   "S",
  ignis:  "S",
  louis:  "S",
  // A — carry kuat, debuffer utama, burst assassin
  isabel: "A",
  ria:    "A",
  poby:   "A",
  // B — alternatif solid, situational picks
  eluna:  "B",
  penny:  "B",
  ceria:  "B",
  // C — utility terbatas / situational
  muriel: "C",
  edel:   "C",
  rina:   "C",
};

const STORAGE_KEY = "rellion_tierlist";

function loadAssignments(): Record<string, Tier> {
  if (typeof window === "undefined") return { ...DEFAULT_ASSIGNMENTS };
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as Record<string, Tier>;
  } catch {}
  return { ...DEFAULT_ASSIGNMENTS };
}

function saveAssignments(data: Record<string, Tier>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function TierListBoard() {
  const [assignments, setAssignments] = useState<Record<string, Tier>>(DEFAULT_ASSIGNMENTS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverTier, setDragOverTier] = useState<Tier | null>(null);

  // Load dari localStorage setelah mount
  useEffect(() => {
    setAssignments(loadAssignments());
  }, []);

  function assign(heroId: string, tier: Tier) {
    setAssignments((prev) => {
      const next = { ...prev, [heroId]: tier };
      saveAssignments(next);
      return next;
    });
    setSelectedId(null);
  }

  // ── Drag handlers ──
  function handleDragStart(heroId: string) {
    setDraggedId(heroId);
    setSelectedId(null);
  }

  function handleDragOver(tier: Tier, e: React.DragEvent) {
    e.preventDefault();
    setDragOverTier(tier);
  }

  function handleDrop(tier: Tier, e: React.DragEvent) {
    e.preventDefault();
    if (draggedId) assign(draggedId, tier);
    setDraggedId(null);
    setDragOverTier(null);
  }

  function handleDragEnd() {
    setDraggedId(null);
    setDragOverTier(null);
  }

  // ── Tap handler untuk mobile ──
  function handleHeroTap(heroId: string) {
    if (selectedId === heroId) {
      setSelectedId(null);
    } else {
      setSelectedId(heroId);
    }
  }

  return (
    <div className="bg-parchment border border-parchment-dark rounded-xl p-4">

      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-parchment-dark">
        <div>
          <h2 className="font-serif text-lg text-ink">Tier List</h2>
          <p className="text-xs text-ink-muted">Drag atau tap hero untuk pindah tier</p>
        </div>
        <button
          onClick={() => {
            setAssignments({ ...DEFAULT_ASSIGNMENTS });
            saveAssignments(DEFAULT_ASSIGNMENTS);
          }}
          className="text-xs font-serif text-ink-muted hover:text-rose transition-colors border border-parchment-dark rounded px-2 py-1"
        >
          Reset
        </button>
      </div>

      {/* Tier columns — S | A | B | C side by side */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {TIERS.map((tier) => {
        const tierHeroes = heroes.filter((h) => assignments[h.id] === tier);
        const meta = TIER_META[tier];
        const isOver = dragOverTier === tier;

        return (
          <div
            key={tier}
            onDragOver={(e) => handleDragOver(tier, e)}
            onDrop={(e) => handleDrop(tier, e)}
            onDragLeave={() => setDragOverTier(null)}
            className={`
              flex flex-col rounded-xl border transition-all min-h-[160px] p-3
              ${isOver
                ? `${meta.border} ${meta.bg} ring-1 ring-offset-0 ${meta.border.replace("border-", "ring-")}`
                : "border-parchment-dark bg-parchment"}
            `}
          >
            {/* Tier label */}
            <div
              className={`
                w-full flex items-center justify-center mb-3 py-1.5 rounded-lg font-serif font-bold text-lg border
                ${meta.color} ${meta.bg} ${meta.border}
              `}
              onClick={() => selectedId && assign(selectedId, tier)}
              title={selectedId ? `Pindahkan ke tier ${tier}` : ""}
              style={{ cursor: selectedId ? "pointer" : "default" }}
            >
              {tier}
            </div>

            {/* Heroes in this tier */}
            <div className="flex flex-wrap gap-2 justify-center flex-1">
              {tierHeroes.length === 0 && (
                <p className="text-xs text-stone italic font-[var(--font-fell)] self-center text-center">
                  {isOver ? "Lepas di sini" : "—"}
                </p>
              )}
              {tierHeroes.map((hero) => {
                const isSelected = selectedId === hero.id;
                const isDragging = draggedId === hero.id;

                return (
                  <div
                    key={hero.id}
                    draggable
                    onDragStart={() => handleDragStart(hero.id)}
                    onDragEnd={handleDragEnd}
                    onClick={() => handleHeroTap(hero.id)}
                    title={hero.name}
                    className={`
                      flex flex-col items-center gap-0.5 p-1.5 rounded-lg border cursor-grab active:cursor-grabbing transition-all
                      ${isSelected
                        ? "border-gold bg-gold/15 ring-1 ring-gold/50 scale-105"
                        : isDragging
                        ? "opacity-40 border-parchment-dark"
                        : "border-parchment-dark hover:border-gold/40 hover:bg-gold/5"}
                    `}
                  >
                    <HeroAvatar hero={hero} size="sm" />
                    <p className="text-[9px] font-serif text-ink leading-tight">{hero.name}</p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      </div>{/* end grid */}

      {/* Tap-to-assign panel — muncul saat hero dipilih */}
      {selectedId && (() => {
        const hero = heroes.find((h) => h.id === selectedId);
        if (!hero) return null;
        return (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20 bg-parchment border border-parchment-dark rounded-xl shadow-lg px-4 py-3 flex items-center gap-3 max-w-sm w-full mx-4">
            <HeroAvatar hero={hero} size="sm" />
            <p className="font-serif text-sm text-ink flex-1">{hero.name}</p>
            <p className="text-xs text-ink-muted font-serif mr-1">→</p>
            {TIERS.map((tier) => {
              const meta = TIER_META[tier];
              const isCurrent = assignments[selectedId] === tier;
              return (
                <button
                  key={tier}
                  onClick={() => assign(selectedId, tier)}
                  className={`
                    w-8 h-8 rounded-lg border font-serif font-bold text-sm transition-all
                    ${isCurrent
                      ? `${meta.color} ${meta.bg} ${meta.border}`
                      : "border-parchment-dark text-ink-muted hover:border-gold/50 hover:text-ink"}
                  `}
                >
                  {tier}
                </button>
              );
            })}
            <button
              onClick={() => setSelectedId(null)}
              className="text-xs text-ink-muted hover:text-rose font-serif ml-1"
            >
              ✕
            </button>
          </div>
        );
      })()}

    </div>
  );
}
