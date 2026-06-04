import { useEffect, useMemo, useRef, useState } from "react";
import { Search, BookOpen, Library, ArrowRight, Sparkles, MapPin } from "lucide-react";

type Book = {
  title: string;
  author: string;
  topic: string;
  campus: "Casa Central" | "San Joaquín" | "Vitacura";
  color: string;
};

const BOOKS: Book[] = [
  { title: "Física universitaria", author: "Sears · Zemansky", topic: "Física Mecánica", campus: "Casa Central", color: "from-blue-700 to-blue-900" },
  { title: "Física para ciencias e ingeniería", author: "Serway · Jewett", topic: "Física Mecánica", campus: "San Joaquín", color: "from-indigo-700 to-indigo-900" },
  { title: "Mecánica clásica", author: "Goldstein, H.", topic: "Física Mecánica", campus: "Casa Central", color: "from-slate-700 to-slate-900" },
  { title: "Cálculo de una variable", author: "Stewart, James", topic: "Matemática", campus: "Casa Central", color: "from-emerald-700 to-emerald-900" },
  { title: "Estructuras de datos y algoritmos", author: "Weiss, Mark Allen", topic: "Informática", campus: "San Joaquín", color: "from-cyan-700 to-cyan-900" },
  { title: "Clean Architecture", author: "Robert C. Martin", topic: "Informática", campus: "Casa Central", color: "from-violet-700 to-violet-900" },
  { title: "Química general", author: "Petrucci, Ralph", topic: "Química", campus: "Casa Central", color: "from-rose-700 to-rose-900" },
  { title: "Mecánica de materiales", author: "Hibbeler, R.C.", topic: "Mecánica", campus: "Casa Central", color: "from-amber-700 to-amber-900" },
  { title: "Termodinámica", author: "Cengel, Yunus", topic: "Mecánica", campus: "San Joaquín", color: "from-orange-700 to-orange-900" },
];

const TOPICS = ["Física Mecánica", "Matemática", "Informática", "Química", "Mecánica", "Electricidad"];
const GUIDES = ["Física", "Informática", "Mecánica", "Química", "Matemática", "Obras Civiles"];

// Fuzzy/typo-tolerant correction
const TYPO_MAP: Record<string, string> = {
  "fisica": "Física Mecánica",
  "fisic": "Física Mecánica",
  "fisica mecania": "Física Mecánica",
  "fisica mecanica": "Física Mecánica",
  "mecan": "Física Mecánica",
  "mecania": "Física Mecánica",
  "matem": "Matemática",
  "matematic": "Matemática",
  "informat": "Informática",
  "quimic": "Química",
  "calculo": "Matemática",
};

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function detectTopic(q: string): string | null {
  const n = normalize(q);
  if (!n) return null;
  // direct typo map
  if (TYPO_MAP[n]) return TYPO_MAP[n];
  // partial match
  for (const key of Object.keys(TYPO_MAP)) {
    if (n.startsWith(key) || key.startsWith(n)) return TYPO_MAP[key];
  }
  // topic name partial
  for (const t of TOPICS) {
    if (normalize(t).includes(n) || n.includes(normalize(t).split(" ")[0])) return t;
  }
  return null;
}

export function SmartSearch({ compact = false, onSubmit }: { compact?: boolean; onSubmit?: (q: string) => void }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const { books, topic, topics, guide, correction } = useMemo(() => {
    const n = normalize(query);
    if (!n) {
      return { books: [] as Book[], topic: null as string | null, topics: [] as string[], guide: null as string | null, correction: null as string | null };
    }
    const detected = detectTopic(query);
    const direct = BOOKS.filter(
      (b) =>
        normalize(b.title).includes(n) ||
        normalize(b.author).includes(n) ||
        normalize(b.topic).includes(n)
    );
    const byTopic = detected ? BOOKS.filter((b) => b.topic === detected) : [];
    const merged = [...new Map([...direct, ...byTopic].map((b) => [b.title, b])).values()].slice(0, 4);

    const matchedTopics = TOPICS.filter((t) => normalize(t).includes(n)).slice(0, 3);
    const allTopics = detected
      ? [detected, ...matchedTopics.filter((t) => t !== detected)].slice(0, 3)
      : matchedTopics;

    const matchedGuide =
      GUIDES.find((g) => normalize(g) === normalize(detected ?? "")) ||
      GUIDES.find((g) => normalize(g).includes(n)) ||
      (detected ? detected.split(" ")[0] : null);

    const exactHit =
      BOOKS.some((b) => normalize(b.title).includes(n) || normalize(b.author).includes(n)) ||
      TOPICS.some((t) => normalize(t) === n);

    return {
      books: merged,
      topic: detected,
      topics: allTopics,
      guide: matchedGuide,
      correction: detected && !exactHit ? detected : null,
    };
  }, [query]);

  const hasResults = books.length > 0 || topics.length > 0 || guide;

  return (
    <div ref={wrapRef} className={`relative ${compact ? "w-full" : "mx-auto w-full max-w-xl"}`}>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && query.trim()) {
            setOpen(false);
            onSubmit?.(query.trim());
          }
        }}
        placeholder="Buscar libros, autores o biblioguías…"
        className={`w-full rounded-xl border border-white/20 bg-white pl-10 pr-4 text-sm text-foreground shadow-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/40 ${
          compact ? "h-9" : "h-10"
        }`}
      />

      {open && query && (
        <div className="absolute left-0 right-0 z-40 mt-2 overflow-hidden rounded-xl border border-border bg-card text-foreground shadow-[0_20px_60px_-15px_rgba(0,47,108,0.35)] ring-1 ring-black/5">
          {!hasResults ? (
            <div className="px-5 py-6 text-center">
              <Search className="mx-auto h-5 w-5 text-muted-foreground" />
              <div className="mt-2 text-sm font-semibold text-primary">Sin resultados directos</div>
              <div className="text-xs text-muted-foreground">
                Prueba con otra palabra clave, autor o materia.
              </div>
            </div>
          ) : (
            <>
              {/* A. LIBROS ENCONTRADOS */}
              {books.length > 0 && (
                <Section label="Libros encontrados" count={books.length}>
                  <ul>
                    {books.map((b) => (
                      <li key={b.title}>
                        <button
                          onClick={() => setOpen(false)}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-secondary/70"
                        >
                          <div
                            className={`grid h-12 w-9 shrink-0 place-items-end rounded-sm bg-gradient-to-br ${b.color} p-1 text-white shadow-sm`}
                          >
                            <BookOpen className="h-3 w-3 opacity-70" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="truncate text-sm font-bold text-primary">{b.title}</div>
                            <div className="truncate text-xs text-muted-foreground">{b.author}</div>
                          </div>
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-200">
                            <MapPin className="h-3 w-3" />
                            Disponible · {b.campus}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {/* B. EXPLORAR TEMAS */}
              {(topics.length > 0 || correction) && (
                <Section label="Explorar temas relacionados">
                  {correction && (
                    <div className="mx-3 mb-1.5 mt-1 flex items-start gap-2 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-xs">
                      <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-foreground" />
                      <div>
                        <span className="text-muted-foreground">Quizás quisiste decir: </span>
                        <button
                          onClick={() => setQuery(correction)}
                          className="font-bold text-primary underline-offset-2 hover:underline"
                        >
                          {correction}
                        </button>
                      </div>
                    </div>
                  )}
                  <ul>
                    {topics.map((t) => (
                      <li key={t}>
                        <button
                          onClick={() => setQuery(t)}
                          className="group flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition hover:bg-secondary/70"
                        >
                          <Search className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="flex-1 text-foreground">
                            Ver todos los libros sobre el tema:{" "}
                            <span className="font-semibold text-primary">{t}</span>
                          </span>
                          <ArrowRight className="h-3.5 w-3.5 text-accent opacity-0 transition group-hover:opacity-100" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {/* C. BIBLIOGUÍAS DIRECTAS */}
              {guide && (
                <Section label="Biblioguías directas">
                  <button
                    onClick={() => setOpen(false)}
                    className="group flex w-full items-center gap-3 bg-primary/[0.03] px-4 py-3 text-left transition hover:bg-primary/10"
                  >
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
                      <Library className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-primary">
                        Ir directo a la Biblioguía de {guide}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        Recursos, bases de datos y referencias por carrera
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-accent transition group-hover:translate-x-0.5" />
                  </button>
                </Section>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Section({
  label,
  count,
  children,
}: {
  label: string;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-border last:border-0">
      <div className="flex items-center justify-between px-4 pb-1 pt-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        <span>{label}</span>
        {typeof count === "number" && (
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-primary">
            {count}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
