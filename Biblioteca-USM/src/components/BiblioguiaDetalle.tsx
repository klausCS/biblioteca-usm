
import { useState } from "react";
import { ArrowLeft, ArrowRight, Database, BookOpen, FileText, Link2, CheckCircle2, XCircle } from "lucide-react";
interface BiblioguiaDetalleProps {
  onBack: () => void;
}
type TabKey = "bases" | "libros" | "tesis" | "sitios";
const TABS: { key: TabKey; label: string }[] = [
  { key: "bases", label: "Bases de Datos" },
  { key: "libros", label: "Libros Recomendados" },
  { key: "tesis", label: "Tesis y Memorias" },
  { key: "sitios", label: "Diccionarios y Sitios Web" },
];
const BASES = [
  {
    badge: "IEEE",
    name: "IEEE Xplore Digital Library",
    desc: "Acceso a papers, journals y conferencias de ingeniería y tecnología.",
    color: "from-blue-700 to-blue-900",
  },
  {
    badge: "ACM",
    name: "ACM Digital Library",
    desc: "Repositorio avanzado de computación científica y sistemas.",
    color: "from-slate-700 to-slate-900",
  },
  {
    badge: "SD",
    name: "ScienceDirect — Computer Science",
    desc: "Artículos revisados por pares en ciencias de la computación.",
    color: "from-orange-700 to-orange-900",
  },
  {
    badge: "SP",
    name: "Springer Link — Computing",
    desc: "Libros, capítulos y revistas de informática y software.",
    color: "from-emerald-700 to-emerald-900",
  },
];
const LIBROS = [
  { title: "Clean Architecture", author: "Robert C. Martin", campus: "Casa Central", available: true, copies: 3 },
  { title: "Software Engineering", author: "Ian Sommerville", campus: "San Joaquín", available: true, copies: 2 },
  { title: "Superpotencias de la IA", author: "Kai-Fu Lee", campus: "Casa Central", available: true, copies: 1 },
  { title: "Inteligencia Artificial: Un Enfoque Moderno", author: "Russell · Norvig", campus: "Casa Central", available: true, copies: 4 },
  { title: "Sistemas operativos modernos", author: "A. Tanenbaum", campus: "San Joaquín", available: false, copies: 0 },
  { title: "The Pragmatic Programmer", author: "Hunt · Thomas", campus: "Casa Central", available: true, copies: 2 },
];
const TESIS = [
  { title: "Detección de anomalías en redes con Deep Learning", author: "P. Rojas", year: 2024 },
  { title: "Plataforma distribuida para análisis de logs en tiempo real", author: "M. Castillo", year: 2024 },
  { title: "Modelos de NLP aplicados a lenguaje formal chileno", author: "A. Vergara", year: 2023 },
  { title: "Arquitectura serverless para sistemas críticos universitarios", author: "C. Pinto", year: 2023 },
];
const SITIOS = [
  "Glosario de Informática e Internet",
  "Diccionario Informático (RAE)",
  "MDN Web Docs",
  "Stack Overflow",
  "Papers With Code",
  "Google Scholar — Computer Science",
  "arXiv.cs",
  "GitHub Explore",
];
export function BiblioguiaDetalle({ onBack }: BiblioguiaDetalleProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("bases");
  return (
    <div className="biblioguia-detalle animate-in fade-in slide-in-from-top-2 duration-300">
      <button
        onClick={onBack}
        className="biblioguia-detalle__back inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold text-primary shadow-sm transition hover:border-primary/40 hover:bg-secondary"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a Especialidades
      </button>
      <header className="biblioguia-detalle__header mt-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <span className="text-xs font-bold uppercase tracking-widest text-accent">Biblioguía Temática</span>
        <h3 className="mt-1 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
          Ingeniería Civil Informática
        </h3>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground sm:text-base">
          Recursos seleccionados, bases de datos especializadas, libros recomendados y material de apoyo exclusivo para la carrera.
        </p>
      </header>
      <nav className="biblioguia-detalle__tabs mt-6 flex flex-wrap gap-2 border-b border-border">
        {TABS.map((t) => {
          const active = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`biblioguia-detalle__tab relative -mb-px rounded-t-lg px-4 py-2.5 text-sm font-semibold transition ${
                active
                  ? "biblioguia-detalle__tab--active border-b-2 border-accent bg-card text-primary"
                  : "border-b-2 border-transparent text-muted-foreground hover:text-primary"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </nav>
      <div className="biblioguia-detalle__tab-content biblioguia-detalle__tab-content--active mt-6">
        {activeTab === "bases" && (
          <div className="grid gap-4 sm:grid-cols-2">
            {BASES.map((b) => (
              <div
                key={b.name}
                className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-primary/40 hover:shadow-md"
              >
                <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${b.color} text-xs font-black text-white shadow-inner`}>
                  {b.badge}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-accent" />
                    <h4 className="text-sm font-bold text-primary">{b.name}</h4>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{b.desc}</p>
                  <a href="#" className="mt-3 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary group-hover:text-accent">
                    Acceder <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === "libros" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LIBROS.map((l) => (
              <div key={l.title} className="rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:border-primary/40 hover:shadow-md">
                <div className="flex aspect-[3/4] items-end overflow-hidden rounded-lg bg-gradient-to-br from-blue-700 to-blue-900 p-3">
                  <div className="text-xs font-bold leading-tight text-white">{l.title}</div>
                </div>
                <div className="mt-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-3.5 w-3.5 text-accent" />
                    <h4 className="text-sm font-bold text-primary line-clamp-1">{l.title}</h4>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{l.author}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">{l.campus}</span>
                    {l.available ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                        <CheckCircle2 className="h-3 w-3" /> {l.copies} disp.
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-semibold text-rose-800">
                        <XCircle className="h-3 w-3" /> Sin stock
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === "tesis" && (
          <div className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-5 py-3 text-xs font-bold uppercase tracking-widest text-primary">
              PRISMA · Departamento de Informática
            </div>
            <ul className="divide-y divide-border">
              {TESIS.map((t) => (
                <li key={t.title} className="flex items-center gap-4 px-5 py-4 transition hover:bg-secondary">
                  <FileText className="h-5 w-5 shrink-0 text-accent" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-primary">{t.title}</div>
                    <div className="text-xs text-muted-foreground">{t.author} · {t.year}</div>
                  </div>
                  <a href="#" className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-foreground transition hover:bg-primary/90">
                    Leer
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        {activeTab === "sitios" && (
          <div className="flex flex-wrap gap-2">
            {SITIOS.map((s) => (
              <a
                key={s}
                href="#"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-primary shadow-sm transition hover:border-accent hover:bg-secondary hover:text-accent-foreground"
              >
                <Link2 className="h-3.5 w-3.5 text-accent" />
                {s}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
const ALL_CAREERS = [
  "Arquitectura",
  "Construcción Civil",
  "Diseño de Productos",
  "Diseño Industrial",
  "Ing. Civil",
  "Ing. Civil Ambiental",
  "Ing. Civil Aeroespacial",
  "Ing. Civil Biomédica",
  "Ing. Civil Eléctrica",
  "Ing. Civil Electrónica",
  "Ing. Civil en Computación",
  "Ing. Civil Industrial",
  "Ing. Civil Informática",
  "Ing. Civil Matemática",
  "Ing. Civil Mecánica",
  "Ing. Civil Metalúrgica",
  "Ing. Civil de Minas",
  "Ing. Civil Química",
  "Ing. Civil Telemática",
  "Ing. Comercial",
  "Ing. en Construcción",
  "Ing. en Diseño de Productos",
  "Ing. en Información y Control",
  "Ing. en Logística",
  "Ing. en Minería",
  "Ing. Estadística",
  "Ing. Mecánica Industrial",
  "Ing. Telemática",
  "Licenciatura en Astronomía",
  "Licenciatura en Física",
  "Licenciatura en Matemática",
  "Licenciatura en Química",
  "Obras Civiles",
  "Pedagogía en Ed. Técnico-Profesional",
  "Pedagogía en Matemática",
  "Química y Farmacia",
  "Técnico Universitario en Electricidad",
];
interface FullListProps {
  onSelect: (name: string) => void;
}
export function BiblioguiasFullList({ onSelect }: FullListProps) {
  const sorted = [...ALL_CAREERS].sort((a, b) => a.localeCompare(b, "es"));
  return (
    <div className="biblioguias__full-list mt-6 animate-in fade-in slide-in-from-top-2 duration-300 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-xs font-bold uppercase tracking-widest text-primary">
          Todas las biblioguías · {sorted.length} carreras
        </div>
        <div className="text-[11px] text-muted-foreground">Ordenadas alfabéticamente</div>
      </div>
      <ul className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((name) => (
          <li key={name}>
            <button
              onClick={() => onSelect(name)}
              className="biblioguias__list-item flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-foreground transition hover:bg-secondary hover:text-primary"
            >
              <span>{name}</span>
              <ArrowRight className="h-3.5 w-3.5 text-accent opacity-0 transition group-hover:opacity-100" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
