import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  CalendarClock,
  BookOpen,
  Library,
  LifeBuoy,
  UserCircle2,
  Clock,
  ArrowRight,
  MapPin,
  GraduationCap,
  Cpu,
  Atom,
  Wrench,
  Building2,
  Sparkles,
  X,
  ChevronDown,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Leaf,
  Newspaper,
  HandCoins,
  Bell,
  FileText,
} from "lucide-react";
import { BookingWizard } from "@/components/BookingWizard";
import { SmartSearch } from "@/components/SmartSearch";
import { CatalogView, type CatalogBook } from "@/components/CatalogView";
import { LoansView, type Loan } from "@/components/LoansView";
import { BiblioguiaDetalle, BiblioguiasFullList } from "@/components/BiblioguiaDetalle";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Biblioteca USM — Descubre, reserva y estudia" },
      {
        name: "description",
        content:
          "Nueva experiencia de la Biblioteca USM: búsqueda inteligente, reserva de salas en un clic y biblioguías por carrera.",
      },
    ],
  }),
  component: Index,
});

const BOOKS = [
  { title: "Física universitaria", author: "Sears · Zemansky", area: "Física", campus: "Casa Central", available: true, copies: 4 },
  { title: "Cálculo de una variable", author: "Stewart, James", area: "Matemática", campus: "Casa Central", available: true, copies: 2 },
  { title: "Estructuras de datos y algoritmos", author: "Weiss, Mark Allen", area: "Informática", campus: "San Joaquín", available: false, copies: 0 },
  { title: "Química general", author: "Petrucci, Ralph", area: "Química", campus: "Casa Central", available: true, copies: 1 },
  { title: "Mecánica de materiales", author: "Hibbeler, R.C.", area: "Mecánica", campus: "Casa Central", available: true, copies: 3 },
  { title: "Circuitos eléctricos", author: "Nilsson, James", area: "Electricidad", campus: "San Joaquín", available: true, copies: 2 },
  { title: "Sistemas operativos modernos", author: "Tanenbaum, A.", area: "Informática", campus: "Casa Central", available: true, copies: 5 },
  { title: "Termodinámica", author: "Cengel, Yunus", area: "Mecánica", campus: "San Joaquín", available: false, copies: 0 },
];

const ROOMS = [
  { id: "S01", capacity: 4, campus: "Casa Central", free: true },
  { id: "S02", capacity: 6, campus: "Casa Central", free: true },
  { id: "Box 3", capacity: 2, campus: "Casa Central", free: false },
  { id: "S04", capacity: 8, campus: "San Joaquín", free: true },
];

const AREAS = [
  {
    name: "Ing. Civil Informática",
    icon: Cpu,
    resources: ["Base de datos IEEE Xplore", "Base de datos ACM", "Biblioguía: Informática", "E-book: Clean Architecture"],
  },
  {
    name: "Ing. Civil Mecánica",
    icon: Wrench,
    resources: ["Norma ASME", "Biblioguía: Mecánica", "Manual Shigley en línea"],
  },
  {
    name: "Física",
    icon: Atom,
    resources: ["Physical Review Letters", "Biblioguía: Física", "Repositorio de tesis"],
  },
  {
    name: "Obras Civiles",
    icon: Building2,
    resources: ["NCh Normas Chilenas", "Biblioguía: Obras Civiles", "ASCE Library"],
  },
  {
    name: "Electricidad",
    icon: Sparkles,
    resources: ["IEEE Power & Energy", "Biblioguía: Electricidad"],
  },
  {
    name: "Pedagogía",
    icon: GraduationCap,
    resources: ["Scopus Educación", "Biblioguía: Educación"],
  },
];

const RECENT = [
  { label: "Volver a ver: Física Universitaria", icon: BookOpen },
  { label: "Última sala reservada: Box 3", icon: CalendarClock },
  { label: "Biblioguía: Informática", icon: Compass2 },
];

const NOTIFS = [
  { title: "Charla: IA aplicada a Ingeniería", date: "Hoy · 18:00 · Aula Magna", tag: "Evento" },
  { title: "Horario extendido fin de semana", date: "Sáb–Dom · 9:00–22:00", tag: "Aviso" },
  { title: "Nuevo recurso: ASME Digital Collection", date: "Disponible desde hoy", tag: "Recurso" },
];

const NEWS = [
  { title: "Clean Architecture", author: "Robert C. Martin", area: "Informática", color: "from-blue-700 to-blue-900" },
  { title: "Diseño en Ingeniería Mecánica de Shigley", author: "Budynas · Nisbett", area: "Mecánica", color: "from-amber-700 to-amber-900" },
  { title: "Inteligencia Artificial: Un Enfoque Moderno", author: "Russell · Norvig", area: "Informática", color: "from-emerald-700 to-emerald-900" },
  { title: "Principios de Química", author: "Atkins · Jones", area: "Química", color: "from-rose-700 to-rose-900" },
  { title: "Estática y Dinámica", author: "Hibbeler", area: "Mecánica", color: "from-purple-700 to-purple-900" },
  { title: "Pensar rápido, pensar despacio", author: "Daniel Kahneman", area: "General", color: "from-slate-700 to-slate-900" },
];

// fallback icon
function Compass2(props: { className?: string }) {
  return <Sparkles {...props} />;
}

function Index() {
  const [query, setQuery] = useState("");
  const [showRooms, setShowRooms] = useState(false);
  const [confirmed, setConfirmed] = useState<string | null>(null);
  const [openArea, setOpenArea] = useState<string | null>(null);
  const [showFullList, setShowFullList] = useState(false);
  const [showBiblioguia, setShowBiblioguia] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [catalogQuery, setCatalogQuery] = useState<string | null>(null);
  const [catalogBookTitle, setCatalogBookTitle] = useState<string | undefined>(undefined);
  const [showLoans, setShowLoans] = useState(false);
  const [loans, setLoans] = useState<Loan[]>([
    {
      id: "l1",
      title: "Cálculo de una variable",
      author: "Stewart, James",
      color: "from-emerald-700 to-emerald-900",
      dueInDays: 3,
      campus: "Biblioteca Casa Central",
    },
    {
      id: "l2",
      title: "Estructuras de datos y algoritmos",
      author: "Weiss, Mark Allen",
      color: "from-cyan-700 to-cyan-900",
      dueInDays: 0,
      campus: "Biblioteca San Joaquín",
    },
  ]);

  const handleReserveFromCatalog = (book: CatalogBook, campus: string) => {
    setLoans((prev) => [
      ...prev,
      {
        id: `l-${Date.now()}`,
        title: book.title,
        author: book.author,
        color: book.color,
        dueInDays: 14,
        campus,
      },
    ]);
  };

  const handleRenew = (id: string) => {
    setLoans((prev) => prev.map((l) => (l.id === id ? { ...l, dueInDays: l.dueInDays + 14 } : l)));
  };

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return BOOKS.filter(
      (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.area.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [query]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 1. CABECERA — Nav bar fija con buscador integrado */}
      <header className="sticky top-0 z-40 border-b border-primary/20 bg-primary text-primary-foreground shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
          <a href="/" className="flex items-center gap-2 shrink-0">
            <div className="grid h-9 w-9 place-items-center rounded-md bg-white/10">
              <Library className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold tracking-tight">Biblioteca USM</div>
              <div className="text-[10px] uppercase tracking-widest opacity-70">Federico Santa María</div>
            </div>
          </a>

          {/* Buscador inteligente — desktop */}
          <div className="mx-auto hidden w-full max-w-xl md:block">
            <SmartSearch
              onSubmit={(q) => {
                setCatalogBookTitle(undefined);
                setCatalogQuery(q);
              }}
              onSelectBook={(title) => {
                setCatalogBookTitle(title);
                setCatalogQuery(title);
              }}
            />
          </div>

          <nav className="ml-auto flex items-center gap-1.5 md:ml-0">
            <button
              onClick={() => setShowRooms(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-2 text-xs font-bold text-accent-foreground transition hover:brightness-105 sm:text-sm"
            >
              <CalendarClock className="h-4 w-4" />
              <span className="hidden sm:inline">Reservar Sala</span>
            </button>
            <div className="relative">
              <button
                onClick={() => setShowNotif((v) => !v)}
                className="relative inline-flex items-center gap-1.5 rounded-full border border-white/20 px-2.5 py-2 text-xs font-semibold transition hover:bg-white/10 sm:text-sm"
                aria-label="Avisos y eventos"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground">
                  {NOTIFS.length}
                </span>
              </button>
              {showNotif && (
                <div className="absolute right-0 z-40 mt-2 w-80 overflow-hidden rounded-2xl border border-border bg-card text-foreground shadow-xl">
                  <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                    <div className="text-xs font-bold uppercase tracking-widest text-primary">Avisos y eventos</div>
                    <button onClick={() => setShowNotif(false)} className="text-muted-foreground hover:text-primary">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <ul>
                    {NOTIFS.map((n) => (
                      <li key={n.title} className="border-b border-border last:border-0">
                        <a href="#" className="block px-4 py-3 transition hover:bg-secondary">
                          <div className="flex items-start justify-between gap-2">
                            <div className="text-sm font-semibold text-primary">{n.title}</div>
                            <span className="shrink-0 rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold text-accent-foreground">{n.tag}</span>
                          </div>
                          <div className="mt-0.5 text-xs text-muted-foreground">{n.date}</div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <a href="#" className="hidden items-center gap-1.5 rounded-full border border-white/20 px-3 py-2 text-xs font-semibold transition hover:bg-white/10 sm:inline-flex sm:text-sm">
              <UserCircle2 className="h-4 w-4" /> Mi Cuenta
            </a>
            <a href="#" className="hidden items-center gap-1.5 rounded-full border border-white/20 px-3 py-2 text-xs font-semibold transition hover:bg-white/10 sm:inline-flex sm:text-sm">
              <LifeBuoy className="h-4 w-4" /> Ayuda
            </a>
          </nav>
        </div>

        {/* Buscador mobile */}
        <div className="border-t border-white/10 px-4 py-2 md:hidden">
           <SmartSearch
            compact
            onSubmit={(q) => {
              setCatalogBookTitle(undefined);
              setCatalogQuery(q);
            }}
            onSelectBook={(title) => {
              setCatalogBookTitle(title);
              setCatalogQuery(title);
            }}
          />
        </div>
      </header>


      {/* 2. HERO — "Lo Esencial": 4 cards de acción directa */}
      <section className="bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Lo esencial</span>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
                ¿Qué necesitas hoy?
              </h1>
            </div>
            <span className="hidden text-sm text-muted-foreground sm:block">Accesos directos sin perderte en menús.</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ActionCard
              icon={CalendarClock}
              title="Reserva de Salas"
              desc="Box y salas grupales"
              badge="3 libres ahora"
              onClick={() => setShowRooms(true)}
              accent
            />
            <ActionCard
              icon={BookOpen}
              title="Catálogo Digital"
              desc="+200.000 títulos físicos y digitales"
              badge="Buscar"
              onClick={() => setCatalogQuery("")}
            />
            <ActionCard
              icon={HandCoins}
              title="Préstamos"
              desc="Renueva o revisa tus libros activos"
              badge={`${loans.length} activos`}
              onClick={() => setShowLoans(true)}
            />
            <ActionCard
              icon={LifeBuoy}
              title="Soporte"
              desc="Bibliotecólogo en línea y FAQ"
              badge="Lun–Vie 9–18"
            />
          </div>
        </div>
      </section>

      {/* 3. ZONA MEDIA: Historial reciente + Biblioguías por especialidad */}

      {/* Barra de historial reciente — delgada y compacta */}
      <div className="border-y border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-2.5 sm:px-6">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
            <Clock className="h-3.5 w-3.5" /> Historial:
          </span>
          {RECENT.map((r) => (
            <button
              key={r.label}
              onClick={() => setQuery(r.label)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-medium text-foreground transition hover:border-accent hover:bg-accent/10"
            >
              <r.icon className="h-3 w-3 text-primary" />
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Biblioguías y Recursos por Especialidad */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Por tu carrera</span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
            Biblioguías y Recursos por Especialidad
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Haz clic en tu carrera para abrir los recursos recomendados y la biblioguía sin salir de aquí.
          </p>
        </div>

         {showBiblioguia ? (
          <div className="mt-8">
            <BiblioguiaDetalle
              onBack={() => {
                setShowBiblioguia(false);
                setOpenArea(null);
              }}
            />
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {AREAS.map((a) => {
                const isOpen = openArea === a.name;
                return (
                  <div
                    key={a.name}
                    className={`rounded-2xl border bg-card transition ${isOpen ? "border-accent shadow-md" : "border-border hover:border-primary/40"}`}
                  >
                    <button
                      onClick={() => setOpenArea(isOpen ? null : a.name)}
                      className="flex w-full items-center gap-3 p-4 text-left"
                    >
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                        <a.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-primary">{a.name}</div>
                        <div className="text-xs text-muted-foreground">{a.resources.length} recursos · Biblioguía</div>
                      </div>
                      <ChevronDown className={`h-4 w-4 text-muted-foreground transition ${isOpen ? "rotate-180 text-accent" : ""}`} />
                    </button>
                    {isOpen && (
                      <div className="border-t border-border px-4 py-3">
                        <ul className="space-y-1.5">
                          {a.resources.map((r) => (
                            <li key={r}>
                              <a href="#" className="group flex items-center justify-between rounded-md px-2 py-1.5 text-sm text-foreground transition hover:bg-secondary">
                                <span>{r}</span>
                                <ArrowRight className="h-3.5 w-3.5 text-accent opacity-0 transition group-hover:opacity-100" />
                              </a>
                            </li>
                          ))}
                        </ul>
                        <button
                          onClick={() => setShowBiblioguia(true)}
                          className="mt-3 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary transition hover:text-accent"
                        >
                          Abrir biblioguía completa <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setShowFullList((v) => !v)}
                className="biblioguias__expand-btn inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-primary shadow-sm transition hover:border-accent hover:bg-secondary"   
                >
                 Ver todas las biblioguías (+31)
                <ChevronDown className={`h-4 w-4 transition ${showFullList ? "rotate-180 text-accent" : ""}`} />
              </button>
            </div>
            {showFullList && (
              <BiblioguiasFullList
                onSelect={(name) => {
                  if (name === "Ing. Civil Informática") {
                    setShowBiblioguia(true);
                    setShowFullList(false);
                  } else {
                    setOpenArea(name);
                  }
                }}
              />
            )}
          </>
        )}
                 </section>

      {/* 3c. PRISMA — Portal de Repositorios Institucionales */}
      <section className="border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex items-center gap-4 md:w-1/3">
              <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-xl border-2 border-primary bg-card text-center">
                <FileText className="h-7 w-7 text-primary" />
                <span className="mt-0.5 text-[10px] font-black tracking-widest text-primary">PRISMA</span>
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Portal Repositorios Institucionales de Monografías Académicas
              </div>
            </div>
            <div className="flex-1 border-l-4 border-accent pl-4 md:pl-6">
              <p className="text-sm leading-relaxed text-foreground sm:text-base">
                En <strong className="text-primary">PRISMA</strong> puedes depositar, explorar y acceder a{" "}
                <strong className="text-primary">memorias, tesis y producción científica</strong> de pregrado, magíster y doctorado.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <a
              href="#"
              className="group rounded-2xl bg-primary p-6 text-primary-foreground shadow-lg transition hover:shadow-xl"
            >
              <div className="text-[10px] font-bold uppercase tracking-widest text-accent">
                Pregrado · Magíster Profesional
              </div>
              <h3 className="mt-2 text-xl font-bold">Repositorio Digital USM</h3>
              <p className="mt-1 text-sm text-primary-foreground/80">Trabajos de Título, Memorias y Tesis.</p>
              <span className="mt-4 inline-flex items-center gap-1 rounded-full border border-primary-foreground/30 bg-primary-foreground/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider transition group-hover:bg-accent group-hover:text-accent-foreground group-hover:border-accent">
                Explorar <ArrowRight className="h-3 w-3" />
              </span>
            </a>
            <a
              href="#"
              className="group rounded-2xl bg-emerald-700 p-6 text-white shadow-lg transition hover:shadow-xl"
            >
              <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-200">
                Magíster Científico · Doctorado
              </div>
              <h3 className="mt-2 text-xl font-bold">CRIS USM</h3>
              <p className="mt-1 text-sm text-white/80">Tesis de postgrado e investigación científica.</p>
              <span className="mt-4 inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider transition group-hover:bg-accent group-hover:text-accent-foreground group-hover:border-accent">
                Explorar <ArrowRight className="h-3 w-3" />
              </span>
            </a>
          </div>
        </div>
      </section>


      {/* 3b. NOVEDADES — Nuevas lecturas con portadas */}
      <section className="border-t border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Novedades</span>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-primary sm:text-3xl">Nuevas lecturas</h2>
              <p className="mt-1 text-sm text-muted-foreground">Últimos títulos incorporados al catálogo.</p>
            </div>
            <a href="#" className="hidden items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary hover:text-accent-foreground sm:inline-flex">
              Ver todo <ArrowRight className="h-3 w-3" />
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {NEWS.map((b) => (
              <a key={b.title} href="#" className="group block">
                <div className={`relative aspect-[2/3] overflow-hidden rounded-lg bg-gradient-to-br ${b.color} p-3 shadow-md transition group-hover:-translate-y-1 group-hover:shadow-lg`}>
                  <div className="flex h-full flex-col justify-between text-white">
                    <BookOpen className="h-5 w-5 opacity-60" />
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest opacity-70">{b.area}</div>
                      <div className="mt-1 text-sm font-bold leading-tight line-clamp-3">{b.title}</div>
                    </div>
                  </div>
                  <div className="absolute inset-y-0 left-0 w-1 bg-black/20"></div>
                </div>
                <div className="mt-2 text-xs font-semibold text-primary line-clamp-1">{b.title}</div>
                <div className="text-[11px] text-muted-foreground line-clamp-1">{b.author}</div>
              </a>
            ))}
          </div>
        </div>
      </section>


      {/* 4. FOOTER — Contenido institucional, ODS, noticias, redes */}
      <footer className="border-t border-border bg-secondary/40 text-foreground">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground">
                  <Library className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-primary">Biblioteca USM</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Federico Santa María</div>
                </div>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Av. España 1680, Valparaíso · Casa Central<br />
                Av. Vicuña Mackenna 3939, San Joaquín
              </p>
              <div className="mt-4 flex gap-2">
                {[Facebook, Instagram, Linkedin, Youtube].map((Icon, i) => (
                  <a key={i} href="#" className="grid h-8 w-8 place-items-center rounded-full border border-border text-primary transition hover:bg-primary hover:text-primary-foreground">
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                <Newspaper className="h-3.5 w-3.5" /> Actualidad USM
              </h4>
              <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Nueva colección sobre IA aplicada</a></li>
                <li><a href="#" className="hover:text-primary">Horarios extendidos en periodo de exámenes</a></li>
                <li><a href="#" className="hover:text-primary">Taller: Cómo citar en IEEE</a></li>
                <li><a href="#" className="hover:text-primary">Noticias generales USM</a></li>
              </ul>
            </div>

            <div>
              <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                <Leaf className="h-3.5 w-3.5" /> Objetivos de Desarrollo Sostenible
              </h4>
              <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                <li>ODS 4 · Educación de calidad</li>
                <li>ODS 9 · Industria, innovación e infraestructura</li>
                <li>ODS 10 · Reducción de desigualdades</li>
                <li>ODS 17 · Alianzas para los objetivos</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Enlaces institucionales</h4>
              <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Portal USM</a></li>
                <li><a href="#" className="hover:text-primary">SIGA / Aula</a></li>
                <li><a href="#" className="hover:text-primary">Repositorio institucional</a></li>
                <li><a href="#" className="hover:text-primary">Política de privacidad</a></li>
                <li><a href="#" className="hover:text-primary">Contacto y reclamos</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
            <span>© Universidad Técnica Federico Santa María — Biblioteca</span>
            <span>Prototipo · Diseño de Interfaces Usuarias · M. Farías · N. Jego · T. Sjøberg</span>
          </div>
        </div>
      </footer>

      {/* Reserva de sala — wizard de 2 pasos */}
      {showRooms && <BookingWizard onClose={() => setShowRooms(false)} />}

      {/* Catálogo Digital */}
      {catalogQuery !== null && (
        <CatalogView
          key={`${catalogBookTitle ?? ""}-${catalogQuery}`}
          initialQuery={catalogBookTitle ? "" : catalogQuery}
          initialBookTitle={catalogBookTitle}
          onClose={() => {
            setCatalogQuery(null);
            setCatalogBookTitle(undefined);
          }}
          onReserve={(book, campus) => {
            handleReserveFromCatalog(book, campus);
            setConfirmed(`Reserva confirmada: ${book.title} en ${campus}`);
          }}
        />
      )}

      {/* Préstamos activos */}
      {showLoans && (
        <LoansView loans={loans} onClose={() => setShowLoans(false)} onRenew={handleRenew} />
      )}

      {confirmed && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-lg">
          ✓ {confirmed}
          <button onClick={() => setConfirmed(null)} className="ml-3 opacity-70 hover:opacity-100">×</button>
        </div>
      )}
    </div>
  );
}

function ActionCard({
  icon: Icon,
  title,
  desc,
  badge,
  accent,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  badge: string;
  accent?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`group flex flex-col items-start gap-3 rounded-2xl border bg-card p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md ${accent ? "border-accent" : "border-border hover:border-primary/40"}`}
    >
      <div className={`grid h-11 w-11 place-items-center rounded-xl ${accent ? "bg-accent text-accent-foreground" : "bg-primary/10 text-primary"}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-bold text-primary">{title}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
      </div>
      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${accent ? "bg-accent/15 text-primary" : "bg-secondary text-secondary-foreground"}`}>
        {badge}
        <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
      </span>
    </button>
  );
}

function SuggestionList({
  items,
  onPick,
}: {
  items: typeof BOOKS;
  onPick: () => void;
}) {
  return (
    <div className="absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-2xl border border-border bg-card text-foreground shadow-lg">
      <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        Sugerencias en tiempo real
      </div>
      {items.map((b) => (
        <button
          key={b.title}
          onClick={onPick}
          className="flex w-full items-center gap-3 border-t border-border px-3 py-2.5 text-left transition hover:bg-secondary"
        >
          {/* Mini portada */}
          <div className="grid h-12 w-9 shrink-0 place-items-end rounded-sm bg-primary p-1 text-primary-foreground">
            <BookOpen className="h-3 w-3 opacity-70" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="truncate text-sm font-semibold text-primary">{b.title}</div>
            <div className="truncate text-xs text-muted-foreground">{b.author} · {b.area}</div>
          </div>
          {b.available ? (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-1 text-[10px] font-bold text-emerald-700">
              <MapPin className="h-3 w-3" /> Disponible · {b.campus}
            </span>
          ) : (
            <span className="shrink-0 rounded-full bg-muted px-2 py-1 text-[10px] font-bold text-muted-foreground">
              Sin copias
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold tracking-tight text-primary">{title}</h3>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full hover:bg-secondary">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
