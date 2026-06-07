import { Fragment, useMemo, useState } from "react";
import {
  X,
  ArrowRight,
  ArrowLeft,
  Users,
  Accessibility,
  Plug,
  Check,
  ChevronDown,
  CalendarClock,
  CalendarDays,
  MapPin,
  User,
  UsersRound,
  Mail,
} from "lucide-react";

const CAMPUSES = ["Casa Central", "San Joaquín", "Vitacura", "Concepción"];

type RoomType = "individual" | "grupal";

type Room = {
  id: string;
  name: string;
  capacity: number;
  slots: { time: string; free: boolean }[];
};

const ROOMS_DATA: Room[] = [
  {
    id: "ind1",
    name: "Box Individual A",
    capacity: 1,
    slots: [
      { time: "09:00", free: true },
      { time: "10:00", free: true },
      { time: "11:00", free: false },
      { time: "12:00", free: true },
      { time: "13:00", free: true },
      { time: "14:00", free: false },
      { time: "15:00", free: true },
      { time: "16:00", free: true },
      { time: "17:00", free: true },
      { time: "18:00", free: false },
    ],
  },
  {
    id: "ind2",
    name: "Box Individual B",
    capacity: 1,
    slots: [
      { time: "09:00", free: false },
      { time: "10:00", free: true },
      { time: "11:00", free: true },
      { time: "12:00", free: true },
      { time: "13:00", free: false },
      { time: "14:00", free: true },
      { time: "15:00", free: true },
      { time: "16:00", free: false },
      { time: "17:00", free: true },
      { time: "18:00", free: true },
    ],
  },
  {
    id: "ind3",
    name: "Box Silencioso",
    capacity: 1,
    slots: [
      { time: "09:00", free: true },
      { time: "10:00", free: true },
      { time: "11:00", free: true },
      { time: "12:00", free: false },
      { time: "13:00", free: true },
      { time: "14:00", free: true },
      { time: "15:00", free: false },
      { time: "16:00", free: true },
      { time: "17:00", free: true },
      { time: "18:00", free: true },
    ],
  },
  {
    id: "box1",
    name: "Box 1",
    capacity: 4,
    slots: [
      { time: "09:00", free: true },
      { time: "10:00", free: false },
      { time: "11:00", free: true },
      { time: "12:00", free: true },
      { time: "13:00", free: true },
      { time: "14:00", free: true },
      { time: "15:00", free: false },
      { time: "16:00", free: false },
      { time: "17:00", free: true },
      { time: "18:00", free: true },
    ],
  },
  {
    id: "box3",
    name: "Box 3",
    capacity: 6,
    slots: [
      { time: "09:00", free: false },
      { time: "10:00", free: true },
      { time: "11:00", free: true },
      { time: "12:00", free: false },
      { time: "13:00", free: true },
      { time: "14:00", free: true },
      { time: "15:00", free: true },
      { time: "16:00", free: true },
      { time: "17:00", free: false },
      { time: "18:00", free: true },
    ],
  },
  {
    id: "sala2",
    name: "Sala 2",
    capacity: 8,
    slots: [
      { time: "09:00", free: true },
      { time: "10:00", free: true },
      { time: "11:00", free: false },
      { time: "12:00", free: true },
      { time: "13:00", free: true },
      { time: "14:00", free: false },
      { time: "15:00", free: true },
      { time: "16:00", free: true },
      { time: "17:00", free: true },
      { time: "18:00", free: false },
    ],
  },
];

export function BookingWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [campus, setCampus] = useState("Casa Central");
  const [type, setType] = useState<RoomType>("grupal");
  const [capacity, setCapacity] = useState(4);
  const [accessibility, setAccessibility] = useState(false);
  const [outlets, setOutlets] = useState(true);
  const [selection, setSelection] = useState<{ room: string; time: string } | null>(null);
  const [termsOpen, setTermsOpen] = useState(false);
  const [terms, setTerms] = useState(false);

  const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [date, setDate] = useState<string>(todayISO);

  const maxISO = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().slice(0, 10);
  }, []);

  const selectedDateLabel = useMemo(() => {
    const [y, m, d] = date.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("es-CL", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  }, [date]);

  const filteredRooms = ROOMS_DATA.filter((r) =>
    capacity === 1 ? r.capacity === 1 : r.capacity >= capacity
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch justify-center bg-primary/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full flex-col overflow-hidden border-border bg-background shadow-2xl sm:h-auto sm:max-h-[92vh] sm:max-w-3xl sm:rounded-3xl sm:border"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-primary px-5 py-4 text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/10">
              <CalendarClock className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-bold leading-tight">Reservar sala de estudio</div>
              <div className="text-[11px] uppercase tracking-widest opacity-70">
                {step === 3 ? "Confirmación" : `Paso ${step} de 2`}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-white/10"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Stepper */}
        {step !== 3 && (
          <div className="flex items-center gap-2 border-b border-border bg-secondary/40 px-5 py-3 text-xs">
            <StepDot n={1} active={step >= 1} done={step > 1} label="Configurar" />
            <div className="h-px flex-1 bg-border" />
            <StepDot n={2} active={step >= 2} done={false} label="Elegir horario" />
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-7">
          {step === 1 && (
            <div className="space-y-7">
              {/* Sede */}
              <Field label="Sede / Campus">
                <div className="flex flex-wrap gap-2">
                  {CAMPUSES.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCampus(c)}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${
                        campus === c
                          ? "border-primary bg-primary text-primary-foreground shadow-sm"
                          : "border-border bg-card text-foreground hover:border-primary/40"
                      }`}
                    >
                      <MapPin className="h-3.5 w-3.5" />
                      {c}
                    </button>
                  ))}
                </div>
              </Field>

              {/* Tipo */}
              <Field label="Tipo de espacio">
                <div className="grid gap-3 sm:grid-cols-2">
                  <TypeCard
                    icon={User}
                    title="Sala de Estudio Individual"
                    desc="Concentración personal · 1 plaza"
                    active={type === "individual"}
                    onClick={() => {
                      setType("individual");
                      setCapacity(1);
                    }}
                  />
                  <TypeCard
                    icon={UsersRound}
                    title="Box Grupal"
                    desc="Trabajo en equipo · 2 a 8 plazas"
                    active={type === "grupal"}
                    onClick={() => {
                      setType("grupal");
                      if (capacity < 2) setCapacity(4);
                    }}
                  />
                </div>
              </Field>

              {/* Fecha */}
              <Field label="Fecha de la reserva">
                <div className="relative max-w-xs">
                  <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                  <input
                    type="date"
                    value={date}
                    min={todayISO}
                    max={maxISO}
                    onChange={(e) => {
                      setDate(e.target.value || todayISO);
                      setSelection(null);
                    }}
                    className="h-10 w-full rounded-xl border border-border bg-card pl-9 pr-3 text-sm font-semibold text-primary outline-none transition focus:border-primary"
                  />
                  <div className="mt-1.5 text-xs capitalize text-muted-foreground">
                    {selectedDateLabel}
                  </div>
                </div>
              </Field>

              {/* Capacidad y filtros */}
              <Field label="Capacidad y filtros">
                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <Users className="mr-1 inline h-3.5 w-3.5" />
                      Personas
                    </span>
                    <div className="relative">
                      <select
                        value={capacity}
                        onChange={(e) => setCapacity(Number(e.target.value))}
                        disabled={type === "individual"}
                        className="h-10 w-full appearance-none rounded-xl border border-border bg-card px-3 pr-8 text-sm font-semibold text-primary outline-none transition focus:border-primary disabled:opacity-50"
                      >
                        {(type === "individual" ? [1] : [2, 3, 4, 5, 6, 7, 8]).map((n) => (
                          <option key={n} value={n}>
                            {n} {n === 1 ? "persona" : "personas"}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </label>

                  <ToggleField
                    icon={Accessibility}
                    label="Accesibilidad"
                    value={accessibility}
                    onChange={setAccessibility}
                  />
                  <ToggleField
                    icon={Plug}
                    label="Enchufes"
                    value={outlets}
                    onChange={setOutlets}
                  />
                </div>
              </Field>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Disponibilidad · {campus}
                  </div>
                  <div className="text-base font-bold capitalize text-primary">{selectedDateLabel}</div>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[11px]">
                  <LegendDot className="border border-emerald-400 bg-emerald-100" label="Libre" />
                  <LegendDot className="bg-accent text-accent-foreground" label="Tu selección" />
                  <LegendDot className="bg-muted" label="Ocupada" />
                </div>
              </div>

              {/* Grilla estilo Google Calendar */}
              <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
                <div
                  className="grid min-w-[520px]"
                  style={{
                    gridTemplateColumns: `64px repeat(${filteredRooms.length}, minmax(110px, 1fr))`,
                  }}
                >
                  {/* Header: esquina + nombres de salas */}
                  <div className="sticky left-0 z-10 border-b border-r border-border bg-card" />
                  {filteredRooms.map((r) => (
                    <div
                      key={r.id}
                      className="border-b border-l border-border bg-secondary/40 px-3 py-2.5 text-center"
                    >
                      <div className="text-xs font-bold text-primary">{r.name}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {r.capacity} {r.capacity === 1 ? "persona" : "pers."}
                      </div>
                    </div>
                  ))}

                  {/* Filas: hora + celdas por sala */}
                  {ROOMS_DATA[0].slots.map((slot, rowIdx) => (
                    <Fragment key={slot.time}>
                      <div className="sticky left-0 z-10 flex items-start justify-end border-r border-border bg-card px-2 pt-1 text-[11px] font-semibold text-muted-foreground">
                        {slot.time}
                      </div>
                      {filteredRooms.map((r) => {
                        const s = r.slots[rowIdx];
                        const isSelected =
                          selection?.room === r.id && selection?.time === s.time;
                        return (
                          <button
                            key={r.id + s.time}
                            disabled={!s.free}
                            onClick={() => setSelection({ room: r.id, time: s.time })}
                            className={`group relative h-14 border-b border-l border-border text-left transition ${
                              isSelected
                                ? "bg-accent ring-2 ring-inset ring-accent"
                                : s.free
                                  ? "bg-emerald-50 hover:bg-emerald-100"
                                  : "cursor-not-allowed bg-muted/60"
                            }`}
                            aria-label={`${r.name} ${s.time} ${s.free ? "libre" : "ocupada"}`}
                          >
                            {isSelected && (
                              <span className="absolute inset-1 flex flex-col justify-between rounded-md bg-accent/90 p-1.5 text-[10px] font-bold text-accent-foreground shadow">
                                <span className="leading-tight">Tu reserva</span>
                                <span className="leading-tight">
                                  {s.time}–{addHour(s.time)}
                                </span>
                              </span>
                            )}
                            {!isSelected && s.free && (
                              <span className="absolute left-1.5 top-1 text-[10px] font-semibold text-emerald-700 opacity-0 transition group-hover:opacity-100">
                                Reservar
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </Fragment>
                  ))}
                </div>
              </div>

              {/* Términos colapsables */}
              <div className="overflow-hidden rounded-2xl border border-border bg-secondary/40">
                <button
                  onClick={() => setTermsOpen((v) => !v)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-primary"
                >
                  Términos y condiciones esenciales
                  <ChevronDown
                    className={`h-4 w-4 transition ${termsOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {termsOpen && (
                  <ul className="space-y-1.5 border-t border-border bg-card px-5 py-3 text-xs text-muted-foreground">
                    <li>• Tolerancia máxima de 15 minutos antes de liberar la sala.</li>
                    <li>• Reserva máxima de 2 horas continuas por estudiante.</li>
                    <li>• Mantener silencio en salas individuales y volumen moderado en boxes.</li>
                    <li>• No se permite consumir alimentos dentro de las salas.</li>
                    <li>• Devolver el espacio en las mismas condiciones recibidas.</li>
                  </ul>
                )}
              </div>

              {/* Checkbox términos */}
              <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-border bg-card p-3 text-sm">
                <input
                  type="checkbox"
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 cursor-pointer accent-primary"
                />
                <span className="text-foreground">
                  Acepto los términos esenciales del uso de salas de estudio.
                </span>
              </label>
            </div>
          )}

          {step === 3 && selection && (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="relative grid h-20 w-20 place-items-center rounded-full bg-emerald-100">
                <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400/30" />
                <Check className="h-10 w-10 text-emerald-600" strokeWidth={3} />
              </div>
              <h3 className="mt-5 text-2xl font-bold tracking-tight text-primary">
                ¡Reserva confirmada!
              </h3>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Tu espacio ya está asegurado. Te esperamos puntual.
              </p>

              <div className="mt-6 w-full max-w-md rounded-2xl border border-border bg-card p-5 text-left shadow-sm">
                <SummaryRow label="Sala" value={`${ROOMS_DATA.find((r) => r.id === selection.room)?.name} · ${campus}`} />
                <SummaryRow label="Fecha" value={selectedDateLabel} />
                <SummaryRow label="Horario" value={`${selection.time} hrs (2 horas)`} />
                <SummaryRow
                  label="Tipo"
                  value={type === "grupal" ? `Box Grupal · ${capacity} personas` : "Sala Individual"}
                />
              </div>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-xs font-semibold text-primary">
                <Mail className="h-3.5 w-3.5" />
                Comprobante enviado a tu correo institucional
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-border bg-card px-5 py-4">
          {step === 1 && (
            <>
              <button
                onClick={onClose}
                className="text-sm font-semibold text-muted-foreground hover:text-primary"
              >
                Cancelar
              </button>
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-accent-foreground shadow-sm transition hover:brightness-105"
              >
                Ver disponibilidad <ArrowRight className="h-4 w-4" />
              </button>
            </>
          )}
          {step === 2 && (
            <>
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4" /> Atrás
              </button>
              <button
                disabled={!selection || !terms}
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-accent-foreground shadow-sm transition hover:brightness-105 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
              >
                {selection
                  ? `Confirmar reserva · ${selection.time}`
                  : "Selecciona un horario"}
                <Check className="h-4 w-4" />
              </button>
            </>
          )}
          {step === 3 && (
            <button
              onClick={onClose}
              className="ml-auto inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition hover:brightness-110"
            >
              Listo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2.5 text-xs font-bold uppercase tracking-widest text-primary">
        {label}
      </div>
      {children}
    </div>
  );
}

function TypeCard({
  icon: Icon,
  title,
  desc,
  active,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition ${
        active
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border bg-card hover:border-primary/40"
      }`}
    >
      <div
        className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${
          active ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <div className="text-sm font-bold text-primary">{title}</div>
        <div className="mt-0.5 text-xs text-muted-foreground">{desc}</div>
      </div>
      {active && (
        <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground">
          <Check className="h-3 w-3" strokeWidth={3} />
        </div>
      )}
    </button>
  );
}

function ToggleField({
  icon: Icon,
  label,
  value,
  onChange,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2.5 text-left transition hover:border-primary/40"
    >
      <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
        <Icon className="h-4 w-4" />
        {label}
      </span>
      <span
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
          value ? "bg-accent" : "bg-muted"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
            value ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  );
}

function StepDot({
  n,
  active,
  done,
  label,
}: {
  n: number;
  active: boolean;
  done: boolean;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-bold ${
          done
            ? "bg-emerald-500 text-white"
            : active
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
        }`}
      >
        {done ? <Check className="h-3 w-3" strokeWidth={3} /> : n}
      </span>
      <span
        className={`text-xs font-semibold uppercase tracking-wider ${
          active ? "text-primary" : "text-muted-foreground"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <span className={`h-3 w-5 rounded-md ${className}`} />
      {label}
    </span>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border py-2 text-sm last:border-0">
      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="text-right font-semibold text-primary">{value}</span>
    </div>
  );
}

function addHour(time: string) {
  const [h, m] = time.split(":").map(Number);
  return `${String((h + 1) % 24).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
