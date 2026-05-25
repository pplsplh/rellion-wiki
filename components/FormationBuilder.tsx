"use client";

import { useState } from "react";
import { heroes, getHeroById } from "@/data/heroes";
import { analyzeSynergies } from "@/lib/synergy";
import { HeroAvatar } from "./HeroAvatar";
import {
  Plus, X, Sparkles, Shield, Heart, Swords, Star,
  AlertTriangle, CheckCircle2,
} from "lucide-react";

export type RowKey = "front" | "mid" | "back";

export interface Slot {
  id: string;
  row: RowKey;
  heroId: string | null;
}

export const INITIAL_SLOTS: Slot[] = [
  { id: "f1", row: "front", heroId: null },
  { id: "f2", row: "front", heroId: null },
  { id: "m1", row: "mid",   heroId: null },
  { id: "m2", row: "mid",   heroId: null },
  { id: "b1", row: "back",  heroId: null },
];

interface FormationBuilderProps {
  slots: Slot[];
  onSlotsChange: (slots: Slot[]) => void;
}

const ROW_META: Record<RowKey, { label: string; hint: string }> = {
  front: { label: "Depan",    hint: "Tank / Bruiser" },
  mid:   { label: "Tengah",   hint: "Support / Buffer" },
  back:  { label: "Belakang", hint: "DPS / Carry" },
};

const RATING_BADGE: Record<string, string> = {
  S: "bg-gold text-ink",
  A: "bg-sage text-parchment",
  B: "bg-frost text-parchment",
  C: "bg-stone text-parchment",
};

const RATING_CARD: Record<string, string> = {
  S: "border-gold/50 bg-gold/10",
  A: "border-sage/50 bg-sage/10",
  B: "border-frost/50 bg-frost/10",
};

const TYPE_SLOT: Record<string, string> = {
  Support: "border-silver/50 bg-silver/5",
  Fighter: "border-rose/50 bg-rose/5",
  Archer:  "border-frost/50 bg-frost/5",
  Tanker:  "border-sage/50 bg-sage/5",
};

export function FormationBuilder({ slots, onSlotsChange }: FormationBuilderProps) {
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);

  const placedIds = slots.map((s) => s.heroId).filter((id): id is string => id !== null);
  const analysis = analyzeSynergies(placedIds);
  const availableHeroes = heroes.filter((h) => !placedIds.includes(h.id));

  function placeHero(slotId: string, heroId: string) {
    onSlotsChange(slots.map((s) => (s.id === slotId ? { ...s, heroId } : s)));
    setActiveSlotId(null);
  }

  function removeHero(slotId: string, e: React.MouseEvent) {
    e.stopPropagation();
    onSlotsChange(slots.map((s) => (s.id === slotId ? { ...s, heroId: null } : s)));
  }

  function reset() {
    onSlotsChange(INITIAL_SLOTS.map((s) => ({ ...s })));
    setActiveSlotId(null);
  }

  const rows: RowKey[] = ["front", "mid", "back"];

  return (
    <div className="bg-parchment border border-parchment-dark rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-serif text-lg text-ink">Atur Formasi</h2>
          <p className="text-xs text-ink-muted">Pilih hingga 5 hero, sinergi terdeteksi otomatis</p>
        </div>
        <button
          onClick={reset}
          className="text-xs font-serif text-ink-muted hover:text-rose transition-colors border border-parchment-dark rounded px-2 py-1"
        >
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* ── Kiri: Formation Grid ── */}
      <div>
        <div className="space-y-2">
          {rows.map((row) => (
            <div key={row} className="flex items-center gap-2">
              {/* Row label */}
              <div className="w-[68px] flex-shrink-0 text-right pr-1">
                <p className="text-xs font-serif text-ink">{ROW_META[row].label}</p>
                <p className="text-[9px] text-stone leading-tight">{ROW_META[row].hint}</p>
              </div>

              {/* Slots */}
              {slots
                .filter((s) => s.row === row)
                .map((slot) => {
                  const hero = slot.heroId ? getHeroById(slot.heroId) : null;
                  const isActive = activeSlotId === slot.id;

                  return hero ? (
                    <div
                      key={slot.id}
                      onClick={() => setActiveSlotId(isActive ? null : slot.id)}
                      className={`relative flex-1 flex flex-col items-center gap-1.5 p-2 border rounded-lg cursor-pointer transition-all hover:brightness-105 ${TYPE_SLOT[hero.type] ?? "border-parchment-dark bg-parchment/60"}`}
                    >
                      <HeroAvatar hero={hero} size="md" />
                      <p className="text-[10px] font-serif text-ink leading-tight text-center w-full truncate px-1">{hero.name}</p>
                      <button
                        onClick={(e) => removeHero(slot.id, e)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose/80 hover:bg-rose text-parchment rounded-full flex items-center justify-center transition-colors shadow-sm"
                        title="Hapus hero"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      key={slot.id}
                      onClick={() => setActiveSlotId(isActive ? null : slot.id)}
                      className={`flex-1 border-2 border-dashed rounded-lg py-3 flex flex-col items-center gap-1 transition-all ${
                        isActive
                          ? "border-sage bg-sage/10"
                          : "border-parchment-dark hover:border-sage/50"
                      }`}
                    >
                      <Plus className="w-4 h-4 text-ink-muted" />
                      <span className="text-[9px] font-serif text-ink-muted">Tambah</span>
                    </button>
                  );
                })}

            </div>
          ))}
        </div>

      </div>{/* end kiri */}

      {/* ── Kanan: Analisis Sinergi ── */}
      <div className="space-y-3">

        {/* Composition Check — always visible */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { has: analysis.composition.hasTank,    icon: Shield, label: "Tank" },
            { has: analysis.composition.hasSupport,  icon: Heart,  label: "Support" },
            { has: analysis.composition.hasCarry,    icon: Star,   label: "Carry" },
            { has: analysis.composition.hasDebuffer, icon: Swords, label: "Debuffer" },
          ].map(({ has, icon: Icon, label }) => (
            <div
              key={label}
              className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-serif ${
                has ? "border-sage/30 bg-sage/10 text-sage" : "border-stone/20 bg-stone/5 text-stone"
              }`}
            >
              <Icon className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{label}</span>
              {has ? <CheckCircle2 className="w-3 h-3 ml-auto" /> : <X className="w-3 h-3 ml-auto opacity-40" />}
            </div>
          ))}
        </div>

        {/* Analisis Sinergi */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-serif text-stone/60 uppercase tracking-widest">✦ Sinergi Aktif</p>
            {analysis.rating !== "-" && (
              <span className={`px-2 py-0.5 rounded text-xs font-serif font-bold ${RATING_BADGE[analysis.rating] ?? "bg-stone/30 text-stone"}`}>
                {analysis.rating}-Rank
              </span>
            )}
          </div>
          {analysis.activeSynergies.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {analysis.activeSynergies.map((rule) => (
                <div
                  key={rule.id}
                  title={rule.description}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border ${RATING_CARD[rule.rating] ?? "border-parchment-dark"}`}
                >
                  <span className={`text-[9px] font-serif font-bold px-1 py-0.5 rounded flex-shrink-0 ${RATING_BADGE[rule.rating] ?? ""}`}>
                    {rule.rating}
                  </span>
                  <p className="text-[10px] font-serif text-ink">{rule.label}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-ink-muted italic">Belum ada sinergi aktif.</p>
          )}

          {/* Warnings + Suggestions */}
          {analysis.warnings.map((w, i) => (
            <div key={i} className="flex items-start gap-1.5 text-xs text-rose">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span>{w}</span>
            </div>
          ))}
          {analysis.suggestions.map((s, i) => (
            <div key={i} className="flex items-start gap-1.5 text-xs text-frost">
              <Sparkles className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span>{s}</span>
            </div>
          ))}
        </div>

      </div>{/* end kanan */}
      </div>{/* end grid */}

      {/* ── Hero Picker — full width, muncul di bawah saat slot aktif ── */}
      {activeSlotId && (
        <div className="mt-4 border border-sage/40 rounded-xl p-3 bg-sage/5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-serif text-sage tracking-widest">PILIH HERO</p>
            <button onClick={() => setActiveSlotId(null)} className="text-ink-muted hover:text-ink">
              <X className="w-4 h-4" />
            </button>
          </div>
          {availableHeroes.length === 0 ? (
            <p className="text-sm text-ink-muted italic text-center py-2">Semua hero sudah ditempatkan.</p>
          ) : (
            <div className="grid grid-cols-5 gap-2">
              {availableHeroes.map((hero) => (
                <button
                  key={hero.id}
                  onClick={() => placeHero(activeSlotId, hero.id)}
                  className="flex flex-col items-center gap-1.5 p-2 border border-parchment-dark rounded-lg hover:border-gold/60 hover:bg-gold/5 transition-all text-center"
                >
                  <HeroAvatar hero={hero} size="md" />
                  <p className="font-serif text-[9px] text-ink leading-tight w-full truncate">{hero.name}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
