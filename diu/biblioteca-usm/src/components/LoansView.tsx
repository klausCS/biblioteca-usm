import { useEffect, useState } from "react";
import { X, BookOpen, RefreshCw, CheckCircle2, CalendarDays } from "lucide-react";

export type Loan = {
  id: string;
  title: string;
  author: string;
  color: string;
  dueInDays: number; // negative = overdue
  campus: string;
};

export function LoansView({
  loans,
  onClose,
  onRenew,
}: {
  loans: Loan[];
  onClose: () => void;
  onRenew: (id: string) => void;
}) {
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleRenew = (l: Loan) => {
    onRenew(l.id);
    setFlash(`"${l.title}" renovado por 14 días más.`);
    setTimeout(() => setFlash(null), 2400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-foreground/40 p-2 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-border bg-primary px-4 py-3 text-primary-foreground sm:px-6">
          <BookOpen className="h-5 w-5" />
          <div>
            <h2 className="text-base font-bold tracking-tight sm:text-lg">Mis Préstamos Activos</h2>
            <p className="text-[11px] opacity-80">
              {loans.length} {loans.length === 1 ? "libro en tu poder" : "libros en tu poder"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto grid h-8 w-8 place-items-center rounded-full border border-white/20 transition hover:bg-white/10"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-secondary/30 px-4 py-5 sm:px-6">
          {loans.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
              <BookOpen className="mx-auto h-6 w-6 text-muted-foreground" />
              <div className="mt-2 text-sm font-semibold text-primary">No tienes préstamos activos</div>
              <p className="text-xs text-muted-foreground">
                Reserva un libro desde el Catálogo Digital para verlo aquí.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {loans.map((l) => {
                const overdue = l.dueInDays < 0;
                const dueToday = l.dueInDays === 0;
                const dueSoon = l.dueInDays > 0 && l.dueInDays <= 3;
                const tagClass = overdue
                  ? "bg-rose-100 text-rose-700 ring-rose-200"
                  : dueToday
                    ? "bg-rose-100 text-rose-700 ring-rose-200"
                    : dueSoon
                      ? "bg-amber-100 text-amber-800 ring-amber-200"
                      : "bg-emerald-100 text-emerald-700 ring-emerald-200";
                const tagText = overdue
                  ? `Atrasado ${Math.abs(l.dueInDays)} días`
                  : dueToday
                    ? "Vence hoy"
                    : `Vence en ${l.dueInDays} días`;

                return (
                  <li
                    key={l.id}
                    className="flex gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm"
                  >
                    <div
                      className={`relative grid aspect-[2/3] h-28 shrink-0 place-items-end overflow-hidden rounded-lg bg-gradient-to-br ${l.color} p-2 text-white shadow-sm`}
                    >
                      <BookOpen className="absolute left-2 top-2 h-4 w-4 opacity-60" />
                      <div className="absolute inset-y-0 left-0 w-1 bg-black/25" />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <span
                        className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${tagClass}`}
                      >
                        <CalendarDays className="h-2.5 w-2.5" /> {tagText}
                      </span>
                      <h3 className="mt-2 text-sm font-bold leading-tight text-primary line-clamp-2">
                        {l.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">{l.author}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">Retiro: {l.campus}</p>

                      <div className="mt-auto pt-3">
                        <button
                          onClick={() => handleRenew(l)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground transition hover:brightness-110"
                        >
                          <RefreshCw className="h-3.5 w-3.5" /> Renovar préstamo
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {flash && (
          <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg">
              <CheckCircle2 className="h-4 w-4" /> {flash}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
