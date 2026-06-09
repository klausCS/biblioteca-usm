import { useEffect, useMemo, useState } from "react";
import {
  X,
  Search,
  BookOpen,
  MapPin,
  ArrowLeft,
  CheckCircle2,
  CalendarClock,
  Layers,
  Eye,
  Tag,
} from "lucide-react";

export type CatalogBook = {
  id: string;
  title: string;
  author: string;
  year: number;
  edition: string;
  area: string;
  topics: string[];
  color: string; // tailwind
  availability: {
    campus: string;
    copies: number;
    nextReturn?: string;
    shelf?: string;
  }[];
};

const CATALOG: CatalogBook[] = [
    {
    id: "fis-serway",
    title: "Física para ciencias e ingeniería",
    author: "Serway · Jewett",
    year: 2019,
    edition: "10ª edición",
    area: "Física",
    topics: ["Mecánica", "Ondas", "Termodinámica"],
    color: "from-indigo-700 to-indigo-900",
    availability: [
      { campus: "Biblioteca Casa Central", copies: 3, shelf: "530 SER 2019" },
      { campus: "Biblioteca San Joaquín", copies: 1, shelf: "530 SER 2019" },
    ],
  },
  {
    id: "mec-goldstein",
    title: "Mecánica Clásica",
    author: "Goldstein, Herbert",
    year: 2014,
    edition: "3ª edición",
    area: "Física",
    topics: ["Mecánica", "Lagrangiana", "Hamiltoniana"],
    color: "from-slate-700 to-slate-900",
    availability: [
      { campus: "Biblioteca Casa Central", copies: 2, shelf: "531 GOL 2014" },
      { campus: "Biblioteca San Joaquín", copies: 0, nextReturn: "12/06" },
    ],
  },
  {
    id: "fis-tipler",
    title: "Física para la ciencia y la tecnología",
    author: "Tipler · Mosca",
    year: 2010,
    edition: "6ª edición",
    area: "Física",
    topics: ["Mecánica", "Óptica", "Física"],
    color: "from-cyan-700 to-cyan-900",
    availability: [
      { campus: "Biblioteca Casa Central", copies: 1, shelf: "530 TIP 2010" },
    ],
  },
  {
    id: "fis-resnick",
    title: "Fundamentos de Física",
    author: "Halliday · Resnick · Walker",
    year: 2017,
    edition: "10ª edición",
    area: "Física",
    topics: ["Mecánica", "Electromagnetismo"],
    color: "from-emerald-700 to-emerald-900",
    availability: [
      { campus: "Biblioteca San Joaquín", copies: 4, shelf: "530 HAL 2017" },
      { campus: "Biblioteca Sede Viña del Mar", copies: 2, shelf: "530 HAL 2017" },
    ],
  },
  {
    id: "fis-feynman",
    title: "Lectures on Physics",
    author: "Feynman · Leighton · Sands",
    year: 2011,
    edition: "New Millennium",
    area: "Física",
    topics: ["Física", "Mecánica Cuántica"],
    color: "from-amber-700 to-amber-900",
    availability: [
      { campus: "Biblioteca Casa Central", copies: 0, nextReturn: "15/06" },
    ],
  },
  {
    id: "inf-algorithms",
    title: "Introduction to Algorithms",
    author: "Cormen · Leiserson · Rivest · Stein",
    year: 2022,
    edition: "4ª edición",
    area: "Informática",
    topics: ["Algoritmos", "Estructuras de datos", "Complejidad computacional"],
    color: "from-violet-700 to-violet-900",
    availability: [
      { campus: "Biblioteca San Joaquín", copies: 6, shelf: "005.1 COR 2022" },
      { campus: "Biblioteca Casa Central", copies: 3, shelf: "005.1 COR 2022" },
    ],
  },
  {
    id: "inf-clean-code",
    title: "Clean Code: A Handbook of Agile Software Craftsmanship",
    author: "Robert C. Martin",
    year: 2008,
    edition: "1ª edición",
    area: "Informática",
    topics: ["Programación", "Ingeniería de software", "Buenas prácticas"],
    color: "from-fuchsia-700 to-fuchsia-900",
    availability: [
      { campus: "Biblioteca San Joaquín", copies: 4, shelf: "005.1 MAR 2008" },
    ],
  },
  {
    id: "civil-mecanica",
    title: "Mecánica de Materiales",
    author: "Beer · Johnston · DeWolf · Mazurek",
    year: 2021,
    edition: "7ª edición",
    area: "Ingeniería Civil",
    topics: ["Esfuerzo", "Deformación", "Vigas", "Columnas"],
    color: "from-orange-700 to-orange-900",
    availability: [
      { campus: "Biblioteca Casa Central", copies: 5, shelf: "620.1 BEE 2021" },
      { campus: "Biblioteca San Joaquín", copies: 2, shelf: "620.1 BEE 2021" },
    ],
  },
  {
    id: "civil-estructuras",
    title: "Análisis Estructural",
    author: "Hibbeler, Russell C.",
    year: 2020,
    edition: "10ª edición",
    area: "Ingeniería Civil",
    topics: ["Estructuras", "Análisis de vigas", "Armaduras"],
    color: "from-stone-600 to-stone-800",
    availability: [
      { campus: "Biblioteca Casa Central", copies: 3, shelf: "624 HIB 2020" },
    ],
  },
  {
    id: "mat-calculo",
    title: "Cálculo de una Variable",
    author: "Stewart, James",
    year: 2016,
    edition: "8ª edición",
    area: "Matemáticas",
    topics: ["Cálculo", "Límites", "Derivadas", "Integrales"],
    color: "from-teal-700 to-teal-900",
    availability: [
      { campus: "Biblioteca Casa Central", copies: 8, shelf: "515 STE 2016" },
      { campus: "Biblioteca San Joaquín", copies: 5, shelf: "515 STE 2016" },
      { campus: "Biblioteca Sede Viña del Mar", copies: 2, shelf: "515 STE 2016" },
    ],
  },
  {
    id: "fis-univ-sears",
    title: "Física Universitaria",
    author: "Sears · Zemansky · Young · Freedman",
    year: 2018,
    edition: "14ª edición",
    area: "Física",
    topics: ["Mecánica", "Electromagnetismo", "Física"],
    color: "from-blue-700 to-blue-900",
    availability: [
      { campus: "Biblioteca Casa Central", copies: 5, shelf: "530 SEA 2018" },
      { campus: "Biblioteca San Joaquín", copies: 2, shelf: "530 SEA 2018" },
      { campus: "Biblioteca Sede Viña del Mar", copies: 0, nextReturn: "08/06" },
    ],
  },

  {
    id: "mat-gebra",
    title: "Álgebra Lineal y sus Aplicaciones",
    author: "Lay, David C.",
    year: 2018,
    edition: "5ª edición",
    area: "Matemáticas",
    topics: ["Álgebra lineal", "Matrices", "Vectores", "Espacios vectoriales"],
    color: "from-rose-700 to-rose-900",
    availability: [
      { campus: "Biblioteca Casa Central", copies: 4, shelf: "512.5 LAY 2018" },
      { campus: "Biblioteca San Joaquín", copies: 3, shelf: "512.5 LAY 2018" },
    ],
  },
  {
    id: "qum-quimica",
    title: "Química: La Ciencia Central",
    author: "Brown · LeMay · Bursten · Murphy · Woodward · Stoltzfus",
    year: 2019,
    edition: "14ª edición",
    area: "Química",
    topics: ["Química general", "Enlaces", "Termoquímica", "Equilibrio"],
    color: "from-green-700 to-green-900",
    availability: [
      { campus: "Biblioteca Casa Central", copies: 5, shelf: "540 BRO 2019" },
      { campus: "Biblioteca San Joaquín", copies: 2, shelf: "540 BRO 2019" },
    ],
  },
  {
    id: "qum-organica",
    title: "Química Orgánica",
    author: "Wade, Leroy G.",
    year: 2017,
    edition: "9ª edición",
    area: "Química",
    topics: ["Química orgánica", "Hidrocarburos", "Reacciones orgánicas"],
    color: "from-lime-700 to-lime-900",
    availability: [
      { campus: "Biblioteca Casa Central", copies: 3, shelf: "547 WAD 2017" },
      { campus: "Biblioteca San Joaquín", copies: 1, shelf: "547 WAD 2017" },
    ],
  },
  {
    id: "mec-termodinamica",
    title: "Termodinámica: Un Enfoque de Ingeniería",
    author: "Çengel · Boles",
    year: 2019,
    edition: "9ª edición",
    area: "Ingeniería Mecánica",
    topics: ["Termodinámica", "Energía", "Entropía", "Ciclos"],
    color: "from-sky-700 to-sky-900",
    availability: [
      { campus: "Biblioteca Casa Central", copies: 4, shelf: "621.402 ÇEN 2019" },
      { campus: "Biblioteca San Joaquín", copies: 2, shelf: "621.402 ÇEN 2019" },
    ],
  },
  {
    id: "mec-fluidos",
    title: "Mecánica de Fluidos",
    author: "White, Frank M.",
    year: 2018,
    edition: "8ª edición",
    area: "Ingeniería Mecánica",
    topics: ["Fluidos", "Dinámica", "Viscosidad", "Turbulencia"],
    color: "from-cyan-800 to-cyan-950",
    availability: [
      { campus: "Biblioteca Casa Central", copies: 3, shelf: "620.1 WHI 2018" },
    ],
  },
  {
    id: "eco-economia",
    title: "Principios de Economía",
    author: "Mankiw, Gregory",
    year: 2020,
    edition: "9ª edición",
    area: "Economía",
    topics: ["Microeconomía", "Macroeconomía", "Mercados", "Política económica"],
    color: "from-yellow-600 to-yellow-800",
    availability: [
      { campus: "Biblioteca Casa Central", copies: 5, shelf: "330 MAN 2020" },
      { campus: "Biblioteca Sede Viña del Mar", copies: 2, shelf: "330 MAN 2020" },
    ],
  },
  {
    id: "eco-contabilidad",
    title: "Contabilidad de Costos",
    author: "Horngren · Datar · Rajan",
    year: 2021,
    edition: "16ª edición",
    area: "Administración",
    topics: ["Costos", "Contabilidad", "Presupuestos", "Gestión"],
    color: "from-pink-700 to-pink-900",
    availability: [
      { campus: "Biblioteca Casa Central", copies: 3, shelf: "657.42 HOR 2021" },
    ],
  },
  {
    id: "elec-circuitos",
    title: "Análisis de Circuitos en Ingeniería",
    author: "Hayt · Kemmerly · Durbin",
    year: 2018,
    edition: "9ª edición",
    area: "Ingeniería Eléctrica",
    topics: ["Circuitos", "Corriente", "Voltaje", "AC/DC"],
    color: "from-red-800 to-red-950",
    availability: [
      { campus: "Biblioteca San Joaquín", copies: 4, shelf: "621.3 HAY 2018" },
      { campus: "Biblioteca Casa Central", copies: 2, shelf: "621.3 HAY 2018" },
    ],
  },
  {
    id: "ind-procesos",
    title: "Diseño y Control de Procesos de Manufactura",
    author: "Groover, Mikell P.",
    year: 2019,
    edition: "5ª edición",
    area: "Ingeniería Industrial",
    topics: ["Manufactura", "Procesos", "Automatización", "Robótica"],
    color: "from-zinc-700 to-zinc-900",
    availability: [
      { campus: "Biblioteca Casa Central", copies: 3, shelf: "670 GRO 2019" },
    ],
  },
];

export function CatalogView({
  initialQuery = "",
  initialBookTitle,
  onClose,
  onReserve,
}: {
  initialQuery?: string;
  onClose: () => void;
  onReserve: (book: CatalogBook, campus: string) => void;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [areaFilter, setAreaFilter] = useState<string>("Todas");
  const [campusFilter, setCampusFilter] = useState<string>("Todos");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [selected, setSelected] = useState<CatalogBook | null>(() => {
    if (!initialBookTitle) return null;
    const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const t = norm(initialBookTitle);
    return (
      CATALOG.find((b) => norm(b.title) === t) ||
      CATALOG.find((b) => norm(b.title).includes(t) || t.includes(norm(b.title))) ||
      null
    );
  });
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const areas = useMemo(() => ["Todas", ...Array.from(new Set(CATALOG.map((b) => b.area)))], []);
  const campuses = useMemo(
    () => ["Todos", ...Array.from(new Set(CATALOG.flatMap((b) => b.availability.map((a) => a.campus))))],
    []
  );


  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && (selected ? setSelected(null) : onClose());
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, selected]);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
     return CATALOG.filter((b) => {
      if (areaFilter !== "Todas" && b.area !== areaFilter) return false;
      if (campusFilter !== "Todos" && !b.availability.some((a) => a.campus === campusFilter)) return false;
      if (availableOnly && !b.availability.some((a) => a.copies > 0)) return false;
      if (!q) return true;
      return (
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.area.toLowerCase().includes(q) ||
        b.topics.some((t) => t.toLowerCase().includes(q))
     );
    });
  }, [query, areaFilter, campusFilter, availableOnly]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-foreground/40 p-2 backdrop-blur-sm sm:p-6">
      <div
        className="flex max-h-[96vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border bg-primary px-4 py-3 text-primary-foreground sm:px-6">
          {selected && (
            <button
              onClick={() => setSelected(null)}
              className="inline-flex items-center gap-1 rounded-full border border-white/20 px-2.5 py-1 text-xs font-semibold transition hover:bg-white/10"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Volver
            </button>
          )}
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            <h2 className="text-base font-bold tracking-tight sm:text-lg">
              {selected ? "Detalle del libro" : "Catálogo Digital"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="ml-auto grid h-8 w-8 place-items-center rounded-full border border-white/20 transition hover:bg-white/10"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto bg-secondary/30">
          {!selected ? (
            <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-7">
              {/* Search */}
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar por título, autor, área o tema…"
                  className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2.5 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/40"
                  autoFocus
                />
              </div>

              {/* Filtros */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Filtros:</span>
                <select
                  value={areaFilter}
                  onChange={(e) => setAreaFilter(e.target.value)}
                  className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-primary outline-none transition hover:border-primary/40 focus:border-accent"
                >
                  {areas.map((a) => (
                    <option key={a} value={a}>Área: {a}</option>
                  ))}
                </select>
                <select
                  value={campusFilter}
                  onChange={(e) => setCampusFilter(e.target.value)}
                  className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-primary outline-none transition hover:border-primary/40 focus:border-accent"
                >
                  {campuses.map((c) => (
                    <option key={c} value={c}>Campus: {c.replace("Biblioteca ", "")}</option>
                  ))}
                </select>
                <button
                  onClick={() => setAvailableOnly((v) => !v)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    availableOnly
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-border bg-card text-primary hover:border-primary/40"
                  }`}
                >
                  Solo disponibles
                </button>
                {(areaFilter !== "Todas" || campusFilter !== "Todos" || availableOnly || query) && (
                  <button
                    onClick={() => {
                      setQuery("");
                      setAreaFilter("Todas");
                      setCampusFilter("Todos");
                      setAvailableOnly(false);
                    }}
                    className="ml-1 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold text-muted-foreground hover:text-primary"
                  >
                    <X className="h-3 w-3" /> Limpiar
                  </button>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-primary">
                  {results.length} resultados encontrados
                </span>
                <span className="text-[11px] text-muted-foreground">Ordenado por relevancia</span>
              </div>

              {/* Grid de tarjetas */}
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {results.map((b) => (
                  <li key={b.id}>
                    <button
                      onClick={() => setSelected(b)}
                      className="group flex w-full gap-4 rounded-2xl border border-border bg-card p-4 text-left transition hover:-translate-y-0.5 hover:border-accent hover:shadow-md"
                    >
                      {/* Portada */}
                      <div
                        className={`relative grid aspect-[2/3] h-32 shrink-0 place-items-end overflow-hidden rounded-lg bg-gradient-to-br ${b.color} p-2 text-white shadow-sm`}
                      >
                        <BookOpen className="absolute left-2 top-2 h-4 w-4 opacity-60" />
                        <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                          {b.area}
                        </div>
                        <div className="absolute inset-y-0 left-0 w-1 bg-black/25" />
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col">
                        {/* Tags de disponibilidad por sede */}
                        <div className="flex flex-wrap gap-1.5">
                          {b.availability
                            .filter((a) => a.copies > 0)
                            .slice(0, 2)
                            .map((a) => (
                              <span
                                key={a.campus}
                                className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-200"
                              >
                                <MapPin className="h-2.5 w-2.5" />
                                Disponible · {a.campus.replace("Biblioteca ", "")}
                              </span>
                            ))}
                          {b.availability.every((a) => a.copies === 0) && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700 ring-1 ring-rose-200">
                              Sin stock
                            </span>
                          )}
                        </div>

                        <h3 className="mt-2 text-base font-bold leading-tight text-primary line-clamp-2">
                          {b.title}
                        </h3>
                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                          {b.author}
                        </p>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          {b.edition} · {b.year}
                        </p>

                        <span className="mt-auto inline-flex items-center gap-1 pt-2 text-[11px] font-bold uppercase tracking-wider text-accent-foreground/80 opacity-0 transition group-hover:opacity-100">
                          Ver detalle →
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <BookDetail
              book={selected}
              onReserve={(campus) => {
                onReserve(selected, campus);
                setConfirmation(`"${selected.title}" reservado en ${campus}.`);
                setTimeout(() => setConfirmation(null), 2800);
              }}
            />
          )}
        </div>

        {confirmation && (
          <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
            <div className="flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg">
              <CheckCircle2 className="h-4 w-4" /> {confirmation} Añadido a tus préstamos.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function BookDetail({
  book,
  onReserve,
}: {
  book: CatalogBook;
  onReserve: (campus: string) => void;
}) {
  const [shelfOpen, setShelfOpen] = useState<string | null>(null);

  return (
    <div className="mx-auto grid max-w-5xl gap-6 px-4 py-6 sm:px-6 md:grid-cols-[320px_1fr]">
      {/* Columna izq */}
      <aside className="rounded-2xl border border-border bg-card p-5">
        <div
          className={`relative mx-auto grid aspect-[2/3] w-44 place-items-end overflow-hidden rounded-xl bg-gradient-to-br ${book.color} p-3 text-white shadow-md`}
        >
          <BookOpen className="absolute left-3 top-3 h-5 w-5 opacity-70" />
          <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">{book.area}</div>
          <div className="absolute inset-y-0 left-0 w-1.5 bg-black/25" />
        </div>

        <h3 className="mt-5 text-xl font-bold leading-tight text-primary">{book.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{book.author}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {book.edition} · {book.year}
        </p>

        <div className="mt-4">
          <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary">
            <Tag className="h-3 w-3" /> Temas
          </div>
          <div className="flex flex-wrap gap-1.5">
            {book.topics.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary ring-1 ring-primary/15"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </aside>

      {/* Columna der */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" />
          <h4 className="text-sm font-bold uppercase tracking-widest text-primary">
            Disponibilidad por campus
          </h4>
        </div>

        <ul className="space-y-3">
          {book.availability.map((a) => {
            const available = a.copies > 0;
            const isShelfOpen = shelfOpen === a.campus;
            return (
              <li
                key={a.campus}
                className="rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:border-primary/30"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-primary">{a.campus}</div>
                        {available ? (
                          <div className="text-xs font-semibold text-emerald-700">
                            {a.copies} {a.copies === 1 ? "copia disponible" : "copias disponibles"}
                          </div>
                        ) : (
                          <div className="text-xs font-semibold text-rose-600">
                            Sin stock disponible — Vuelve el {a.nextReturn}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {available && (
                       <button
                        onClick={() => setShelfOpen(isShelfOpen ? null : a.campus)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-bold text-primary transition hover:border-primary/30"
                      >
                        <Eye className="h-3.5 w-3.5" /> Ver en estantería
                      </button>
                    )}
                  </div>
                </div>

                {isShelfOpen && available && (
                  <div className="mt-3 rounded-xl border border-dashed border-border bg-secondary/50 p-3 text-xs text-foreground">
                    <div className="font-bold text-primary">Clasificación: {a.shelf}</div>
                    <div className="mt-0.5 text-muted-foreground">
                      Sección Ciencias Exactas · Estantería 4 · Nivel 2
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
