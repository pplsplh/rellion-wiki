import Link from "next/link";
import { RoadmapSection } from "@/components/RoadmapSection";
import { Divider } from "@/components/Divider";
import { HeroShowcase } from "@/components/HeroShowcase";
import { Sparkles, ChevronRight, Map, Users, Swords, BookOpen } from "lucide-react";

const FEATURES = [
  {
    icon: Map,
    title: "Interactive Roadmap",
    desc: "From wanderer to champion — a path laid in ancient ink.",
    href: "#roadmap",
  },
  {
    icon: Users,
    title: "Hero Compendium",
    desc: "Every soul has a story. Study them before battle.",
    href: "/roster",
  },
  {
    icon: Swords,
    title: "Formation Guide",
    desc: "The difference between victory and ruin is one deployment order.",
    href: "/builder",
  },
  {
    icon: BookOpen,
    title: "Synergy Atlas",
    desc: "Even without gold, the clever adventurer prospers.",
    href: "/builder",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroShowcase />

      {/* ── Features ── */}
      <section className="py-20 px-4 bg-parchment">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-12 bg-stone/40" />
              <p className="text-xs font-serif text-stone uppercase tracking-[0.3em]">
                ✦ Adventurer's Codex ✦
              </p>
              <div className="h-px w-12 bg-stone/40" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-ink mb-4">
              What Awaits the Wanderer
            </h2>
            <p className="text-ink-muted italic font-[var(--font-fell)] max-w-2xl mx-auto">
              Ancient knowledge, forged into scrolls — everything you need to survive and conquer Rellion.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, href }, i) => (
              <Link
                key={title}
                href={href}
                className="group relative p-6 rounded-xl border border-parchment-dark hover:border-gold/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden block"
              >
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/35 to-transparent" />
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-sage/20 flex items-center justify-center border border-sage/15 group-hover:bg-sage/30 transition-colors">
                    <Icon className="w-6 h-6 text-sage" />
                  </div>
                  <span className="font-serif text-xs text-stone/45 tracking-widest pt-1">
                    {["I", "II", "III", "IV"][i]}
                  </span>
                </div>
                <h3 className="font-serif text-lg text-ink mb-1 group-hover:text-ink-soft transition-colors">{title}</h3>
                <div className="h-px bg-gradient-to-r from-gold/25 to-transparent mb-2" />
                <p className="text-sm text-ink-muted italic font-[var(--font-fell)] leading-relaxed mb-3">{desc}</p>
                <span className="text-[10px] font-serif text-gold/50 group-hover:text-gold/80 transition-colors tracking-widest uppercase flex items-center gap-1">
                  Enter <ChevronRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Roadmap ── */}
      <section id="roadmap" className="bg-parchment-dark">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <p className="text-[9px] font-serif text-stone/60 uppercase tracking-[0.4em] mb-2">
              — Chronicle of the Realm —
            </p>
            <h2 className="font-serif text-2xl md:text-3xl text-ink mb-2">
              {"The Wanderer's Chronicle"}
            </h2>
            <p className="text-ink-muted italic font-[var(--font-fell)] text-sm md:text-base">
              From the first step to the final horizon — the path of the wanderer.
            </p>
          </div>
          <Divider />
        </div>

        <div className="max-w-4xl mx-auto px-4 pb-12">
          <RoadmapSection />
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 bg-deep-forest">
        <div className="max-w-4xl mx-auto text-center">
          <Sparkles className="w-12 h-12 text-gold mx-auto mb-6" />

          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-20 bg-gold/30" />
            <span className="text-gold/60 text-sm">✦</span>
            <div className="h-px w-20 bg-gold/30" />
          </div>

          <h2 className="font-serif text-3xl md:text-4xl text-parchment mb-4">
            The Realm Awaits Your Arrival
          </h2>
          <p className="text-sage-light mb-6 max-w-xl mx-auto italic font-[var(--font-fell)]">
            The path is long, the enemies many — but those who study the ancient knowledge shall prevail.
          </p>

          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-20 bg-gold/20" />
            <span className="text-gold/40 text-sm">✦</span>
            <div className="h-px w-20 bg-gold/20" />
          </div>

          <Link
            href="/roster"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gold hover:bg-gold/90 text-ink font-serif rounded-md transition-colors"
          >
            Begin Your Quest <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 px-4 bg-ink">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold" />
            <span className="font-serif text-parchment">Rellion Wiki</span>
          </div>
          <p className="text-sm text-stone-light text-center italic font-[var(--font-fell)]">
            A chronicle forged by a wanderer, for wanderers. Game by DAERI SOFT.
          </p>
          <p className="text-xs text-stone font-serif tracking-wider">✦ FREE TO PLAY ✦</p>
        </div>
      </footer>
    </main>
  );
}
