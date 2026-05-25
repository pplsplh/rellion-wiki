"use client";

import { useState } from "react";
import { heroes, getHeroById } from "@/data/heroes";
import { synergyRules } from "@/data/synergies";
import { getHeroSynergies } from "@/lib/synergy";
import { Hero } from "@/types";
import { HeroAvatar } from "./HeroAvatar";
import { HeroBadge } from "./HeroBadge";
import { ChevronDown } from "lucide-react";

const STAT_LABELS = [
  { key: "power",      label: "Power",       suffix: "" },
  { key: "atk",        label: "ATK",         suffix: "" },
  { key: "def",        label: "DEF",         suffix: "" },
  { key: "hp",         label: "HP",          suffix: "" },
  { key: "critChance", label: "CRIT Chance", suffix: "%" },
  { key: "critDmg",    label: "CRIT DMG",    suffix: "%" },
  { key: "atkSpeed",   label: "ATK Speed",   suffix: "%" },
  { key: "moveSpeed",  label: "Move Speed",  suffix: "%" },
] as const;

type StatKey = typeof STAT_LABELS[number]["key"];

const RATING_BADGE: Record<string, string> = {
  S: "bg-gold text-ink",
  A: "bg-sage text-parchment",
  B: "bg-frost text-parchment",
  C: "bg-stone text-parchment",
};

const SLOT_LABELS = ["Hero A", "Hero B", "Hero C"] as const;

const heroesWithStats = heroes.filter((h) => h.stats);

function HeroPicker({ label, selected, onChange, exclude = [] }: {
  label: string;
  selected: Hero | null;
  onChange: (h: Hero | null) => void;
  exclude?: string[];
}) {
  const [open, setOpen] = useState(false);
  const options = heroesWithStats.filter((h) => !exclude.includes(h.id));

  return (
    <div>
      <p className="text-[10px] font-serif text-ink-muted mb-1.5 text-center tracking-wider uppercase">{label}</p>
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center gap-2 p-2.5 border border-parchment-dark rounded-xl bg-parchment hover:border-gold/50 transition-all"
        >
          {selected ? (
            <>
              <HeroAvatar hero={selected} size="sm" />
              <div className="flex-1 text-left min-w-0">
                <p className="font-serif text-sm text-ink font-medium truncate">{selected.name}</p>
                <p className="text-[10px] text-ink-muted">{selected.role}</p>
              </div>
            </>
          ) : (
            <div className="flex-1 text-left">
              <p className="font-serif text-ink-muted text-xs">Pilih hero...</p>
            </div>
          )}
          <ChevronDown className={`w-3.5 h-3.5 text-ink-muted transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div className="absolute top-full left-0 right-0 mt-1 z-20 bg-parchment border border-parchment-dark rounded-xl shadow-lg overflow-hidden max-h-56 overflow-y-auto">
            <button
              onClick={() => { onChange(null); setOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs text-stone font-serif hover:bg-parchment-dark transition-colors border-b border-parchment-dark"
            >
              — Kosongkan
            </button>
            {options.map((h) => (
              <button
                key={h.id}
                onClick={() => { onChange(h); setOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 hover:bg-parchment-dark transition-colors ${
                  selected?.id === h.id ? "bg-gold/10" : ""
                }`}
              >
                <HeroAvatar hero={h} size="sm" />
                <div className="flex-1 text-left min-w-0">
                  <p className="font-serif text-xs text-ink truncate">{h.name}</p>
                  <HeroBadge type={h.type} />
                </div>
                <span className="text-[9px] text-stone font-serif flex-shrink-0">
                  {h.stats!.power.toLocaleString()}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function getWinnerIndices(slots: (Hero | null)[], key: StatKey): Set<number> {
  const vals = slots.map((h) => (h?.stats ? (h.stats[key] as number) : null));
  const defined = vals.filter((v): v is number => v !== null);
  if (defined.length < 2) return new Set();
  const max = Math.max(...defined);
  const winners = new Set<number>();
  vals.forEach((v, i) => { if (v === max) winners.add(i); });
  return winners;
}

function SkillsPanel({ hero }: { hero: Hero | null }) {
  if (!hero) {
    return (
      <div className="p-4 text-center text-xs text-stone italic font-[var(--font-fell)]">
        Belum dipilih
      </div>
    );
  }
  return (
    <div className="p-3 space-y-3">
      {hero.skills.map((sk, i) => (
        <div key={i} className="flex gap-2 items-start">
          <span className="text-[10px] text-stone font-serif flex-shrink-0 mt-0.5 w-6">Lv{sk.level}</span>
          <p className="text-xs text-ink-muted leading-relaxed">{sk.desc}</p>
        </div>
      ))}
    </div>
  );
}

function SynergiesPanel({ hero, highlightIds }: { hero: Hero | null; highlightIds: string[] }) {
  if (!hero) {
    return (
      <div className="p-4 text-center text-xs text-stone italic font-[var(--font-fell)]">
        Belum dipilih
      </div>
    );
  }
  const rules = getHeroSynergies(hero.id);
  if (rules.length === 0) {
    return <div className="p-3 text-xs text-stone italic">Tidak ada sinergi khusus.</div>;
  }
  return (
    <div className="p-3 space-y-2.5">
      {rules.map((rule) => {
        const partners = rule.heroes.filter((id) => id !== hero.id);
        const hasHighlight = partners.some((id) => highlightIds.includes(id));
        return (
          <div
            key={rule.id}
            className={`p-2 rounded-lg border ${
              hasHighlight ? "border-gold/40 bg-gold/5" : "border-parchment-dark"
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <span className={`text-[9px] font-serif font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${RATING_BADGE[rule.rating] ?? ""}`}>
                {rule.rating}
              </span>
              <p className="text-[10px] font-serif text-ink leading-tight flex-1">{rule.label}</p>
              {hasHighlight && (
                <span className="text-[8px] font-serif px-1 py-0.5 bg-gold/20 text-gold rounded-full">COCOK</span>
              )}
            </div>
            <div className="flex flex-wrap gap-1">
              {partners.map((id) => {
                const p = getHeroById(id);
                if (!p) return null;
                const isHighlighted = highlightIds.includes(id);
                return (
                  <span
                    key={id}
                    className={`text-[9px] font-serif px-1.5 py-0.5 rounded-full border ${
                      isHighlighted
                        ? "border-gold/50 bg-gold/10 text-gold"
                        : "border-parchment-dark text-stone"
                    }`}
                  >
                    {p.name}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function HeroCompare() {
  const [slots, setSlots] = useState<[Hero | null, Hero | null, Hero | null]>([null, null, null]);

  const [heroA, heroB, heroC] = slots;

  function setSlot(index: 0 | 1 | 2, hero: Hero | null) {
    setSlots((prev) => {
      const next = [...prev] as [Hero | null, Hero | null, Hero | null];
      next[index] = hero;
      return next;
    });
  }

  const selectedIds = slots.map((h) => h?.id).filter(Boolean) as string[];
  const activeSlots = slots.filter((h): h is Hero => h !== null && !!h.stats);
  const showStats = activeSlots.length >= 1;
  const showExtra = selectedIds.length >= 1;

  // Shared synergies: any rule where 2+ selected heroes appear together
  const sharedRules = synergyRules.filter((rule) => {
    const involved = rule.heroes.filter((id) => selectedIds.includes(id));
    return involved.length >= 2;
  });

  return (
    <div className="space-y-4">

      {/* ── Pickers: 3 kolom ── */}
      <div className="bg-parchment border border-parchment-dark rounded-xl p-4">
        <div className="grid grid-cols-3 gap-3">
          {([0, 1, 2] as const).map((i) => (
            <HeroPicker
              key={i}
              label={SLOT_LABELS[i]}
              selected={slots[i]}
              onChange={(h) => setSlot(i, h)}
              exclude={slots.filter((_, j) => j !== i).map((h) => h?.id).filter(Boolean) as string[]}
            />
          ))}
        </div>
      </div>

      {/* ── Stats Table ── */}
      {showStats && (
        <div className="bg-parchment border border-parchment-dark rounded-xl overflow-hidden">
          {/* Header row */}
          <div className="grid border-b border-parchment-dark" style={{ gridTemplateColumns: `140px repeat(3, 1fr)` }}>
            <div className="p-3 flex items-center">
              <p className="text-[10px] font-serif text-stone uppercase tracking-widest">Stat Lv.160</p>
            </div>
            {slots.map((hero, i) => (
              <div key={i} className="p-3 text-center border-l border-parchment-dark">
                {hero ? (
                  <>
                    <HeroAvatar hero={hero} size="sm" className="mx-auto mb-1" />
                    <p className="text-xs font-serif text-ink font-medium leading-tight">{hero.name}</p>
                    <p className="text-[9px] text-stone">{SLOT_LABELS[i]}</p>
                  </>
                ) : (
                  <p className="text-[10px] text-stone italic font-[var(--font-fell)] pt-2">{SLOT_LABELS[i]}</p>
                )}
              </div>
            ))}
          </div>

          {/* Stat rows */}
          {STAT_LABELS.map(({ key, label, suffix }) => {
            const winners = getWinnerIndices(slots, key);
            return (
              <div
                key={key}
                className="grid border-b border-parchment-dark last:border-0"
                style={{ gridTemplateColumns: `140px repeat(3, 1fr)` }}
              >
                <div className="p-3 flex items-center border-r border-parchment-dark">
                  <p className="text-[10px] font-serif text-ink-muted">{label}</p>
                </div>
                {slots.map((hero, i) => {
                  const isWinner = winners.has(i);
                  const val = hero?.stats ? (hero.stats[key] as number) : null;
                  return (
                    <div
                      key={i}
                      className={`p-3 text-center border-l border-parchment-dark ${isWinner ? "bg-sage/10" : ""}`}
                    >
                      {val !== null ? (
                        <p className={`font-serif text-sm font-medium ${isWinner ? "text-sage" : "text-ink"}`}>
                          {val.toLocaleString()}{suffix}
                          {isWinner && <span className="ml-1 text-[10px]">▲</span>}
                        </p>
                      ) : (
                        <p className="text-sm text-stone">—</p>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Shared Synergy Highlight ── */}
      {sharedRules.length > 0 && (
        <div className="bg-gold/5 border border-gold/30 rounded-xl p-4">
          <p className="text-[10px] font-serif text-gold tracking-[0.15em] uppercase mb-3">
            ✦ Sinergi Bersama — {selectedIds.map(id => getHeroById(id)?.name).filter(Boolean).join(" + ")} ✦
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {sharedRules.map((rule) => (
              <div key={rule.id} className="flex gap-2 items-start p-2 rounded-lg border border-gold/20 bg-parchment">
                <span className={`text-[10px] font-serif font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${RATING_BADGE[rule.rating] ?? ""}`}>
                  {rule.rating}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-serif text-ink font-medium">{rule.label}</p>
                  <p className="text-[10px] text-ink-muted leading-relaxed mt-0.5">{rule.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Skills ── */}
      {showExtra && (
        <div className="bg-parchment border border-parchment-dark rounded-xl overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-3 border-b border-parchment-dark">
            {slots.map((hero, i) => (
              <div key={i} className={`p-2.5 text-center ${i > 0 ? "border-l border-parchment-dark" : ""}`}>
                <p className="text-[10px] font-serif text-stone uppercase tracking-widest">
                  {hero ? hero.name : SLOT_LABELS[i]} — Skills
                </p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 divide-x divide-parchment-dark">
            {slots.map((hero, i) => (
              <SkillsPanel key={i} hero={hero} />
            ))}
          </div>
        </div>
      )}

      {/* ── Synergies ── */}
      {showExtra && (
        <div className="bg-parchment border border-parchment-dark rounded-xl overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-3 border-b border-parchment-dark">
            {slots.map((hero, i) => (
              <div key={i} className={`p-2.5 text-center ${i > 0 ? "border-l border-parchment-dark" : ""}`}>
                <p className="text-[10px] font-serif text-stone uppercase tracking-widest">
                  {hero ? hero.name : SLOT_LABELS[i]} — Sinergi
                </p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 divide-x divide-parchment-dark">
            {slots.map((hero, i) => {
              const otherIds = slots
                .filter((_, j) => j !== i)
                .map((h) => h?.id)
                .filter(Boolean) as string[];
              return <SynergiesPanel key={i} hero={hero} highlightIds={otherIds} />;
            })}
          </div>
        </div>
      )}

    </div>
  );
}
