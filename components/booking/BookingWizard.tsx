"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Check, ChevronLeft, ChevronRight, Lock, Copy, CheckCheck, Building2 } from "lucide-react";
import { bookingAddOns } from "@/data/gear";
import { BANK, DEPOSIT_PERCENT } from "@/lib/bank-details";

// "Add-ons" step is temporarily disabled — see notes near the `AddOnId` type below.
const STEP_LABELS = ["Select Departure", "Travellers", "Your Details", "Review & Pay"];

function BookingSteps({ step }: { step: number }) {
  return (
    <div className="fixed top-16 left-0 right-0 z-[99] bg-bone border-b-1 border-divider px-6 md:px-10">
      <div className="max-w-[1100px] mx-auto flex">
        {STEP_LABELS.map((label, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <div
              key={label}
              className={`flex-1 flex flex-col items-center py-3 transition-colors ${
                active ? "border-brand" : "border-transparent"
              }`}
            >
              <div
                className={`w-[26px] h-[26px] rounded-full flex items-center justify-center mb-1.5 transition-all ${
                  done
                    ? "bg-brand border-brand border-2"
                    : active
                    ? "bg-brand "
                    : "border-2 border-divider"
                }`}
              >
                {done ? (
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                ) : (
                  <span className={`font-mono text-xs ${active ? "text-white" : "text-ink/35"}`}>{i + 1}</span>
                )}
              </div>
              <div
                className={`text-xs font-medium whitespace-nowrap hidden sm:block ${
                  done ? "text-brand" : active ? "text-ink" : "text-ink/35"
                }`}
              >
                {label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
import { formatPrice } from "@/lib/utils";
import { BookingPolicySummary } from "./BookingPolicySummary";
import { CancellationTimeline } from "./CancellationTimeline";

// Fallback departures shown while DB loads or if DB is unavailable
const FALLBACK_DATES = [
  { id: "dep-002", date: "2026-05-12", endDate: "2026-05-21", guide: "Blerim H.", spots: 3, total: 12, price: 1290, low: true },
  { id: "dep-003", date: "2026-06-09", endDate: "2026-06-18", guide: "Artan K.", spots: 8, total: 12, price: 1290, low: false },
  { id: "dep-004", date: "2026-07-07", endDate: "2026-07-16", guide: "Dragan M.", spots: 12, total: 12, price: 1290, low: false },
  { id: "dep-005", date: "2026-08-04", endDate: "2026-08-13", guide: "Blerim H.", spots: 5, total: 12, price: 1290, low: false },
];

type Departure = { id: string; date: string; endDate: string; guide: string; spots: number; total: number; price: number; low: boolean };

export type BookingWizardServerData = {
  tourTitle: string;
  basePrice: number;
  departures: Departure[];
};

// Add-ons (gear rental, airport transfer, single supplement) are temporarily disabled.
// These are subject to real supplier availability and prices that need to be checked
// manually before we can quote them up front. The catalog (names/prices/descriptions)
// lives in `bookingAddOns` (data/gear.ts) — the single source of truth, also used by
// the gear-rental pages — rather than being duplicated here.
// To re-enable: uncomment the Step 3 JSX block, `toggleAddOn`, and the pricing lines
// in the total calculation, and the related summary line items below. You'll also need
// an icon per addon.icon key (e.g. `{ backpack: Backpack, car: Car, bed: BedDouble }`
// from lucide-react) for the Step 3 cards.

type AddOnId = (typeof bookingAddOns)[number]["id"];

interface BookingState {
  departureId: string | null;
  adults: number;
  children: number;
  addOns: Set<AddOnId>;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dietary: string;
  emergencyName: string;
  emergencyPhone: string;
  fitness: string;
  paymentOption: "deposit" | "full";
  agreeTerms: boolean;
  agreeHealth: boolean;
}

function formatShortDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function BookingWizard({
  tourSlug = "peaks-of-the-balkans",
  serverData,
  preselectedDepartureId = null,
}: {
  tourSlug?: string;
  serverData?: BookingWizardServerData | null;
  preselectedDepartureId?: string | null;
}) {
  // When the user clicks "Book" on a specific departure, skip straight to the
  // Travellers step with that departure already selected. The general
  // "Book This Tour" CTA omits the departure and starts at step 0.
  const [step, setStep] = useState(preselectedDepartureId ? 1 : 0);
  const [confirmed, setConfirmed] = useState(false);
  const [bookingError, setBookingError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableDates, setAvailableDates] = useState<Departure[]>(serverData?.departures ?? FALLBACK_DATES);

  // Use server-prefetched data when available; otherwise fetch it on the client as a fallback.
  useEffect(() => {
    if (serverData?.departures?.length) {
      setAvailableDates(serverData.departures);
      return;
    }

    fetch(`/api/public/tours/${tourSlug}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.departures) && data.departures.length > 0) {
          setAvailableDates(
            data.departures.map((d: {
              id: number; startDate: string; endDate: string;
              guideName?: string; spotsLeft: number; capacity: number;
              pricePerPersonEur?: string;
            }) => ({
              id: String(d.id),
              date: d.startDate,
              endDate: d.endDate,
              guide: d.guideName ?? "TBC",
              spots: d.spotsLeft,
              total: d.capacity,
              price: d.pricePerPersonEur ? parseFloat(d.pricePerPersonEur) : 1290,
              low: d.spotsLeft <= 3,
            }))
          );
        }
      })
      .catch(() => {}); // silently keep fallback
  }, [tourSlug, serverData]);

  const [state, setState] = useState<BookingState>({
    departureId: preselectedDepartureId,
    adults: 1,
    children: 0,
    addOns: new Set(),
    firstName: "", lastName: "", email: "", phone: "",
    dietary: "", emergencyName: "", emergencyPhone: "", fitness: "",
    paymentOption: "deposit",
    agreeTerms: false,
    agreeHealth: false,
  });

  const selectedDep = availableDates.find((d) => d.id === state.departureId) ?? null;
  const basePrice = selectedDep?.price ?? serverData?.basePrice ?? 1290;
  const adultTotal = basePrice * state.adults;
  const childTotal = Math.round(basePrice * 0.85) * state.children;
  // Add-ons disabled — see notes near the `AddOnId` type above.
  // const GEAR_RENTAL_DAYS = 10; // matches the standard itinerary length
  // const addOnsTotal = bookingAddOns
  //   .filter((addon) => state.addOns.has(addon.id))
  //   .reduce((sum, addon) => {
  //     if (addon.priceType === "per-day") return sum + addon.price * GEAR_RENTAL_DAYS;
  //     if (addon.priceType === "per-person") return sum + addon.price * (state.adults + state.children);
  //     return sum + addon.price; // flat
  //   }, 0);
  const addOnsTotal = 0;
  const grandTotal = adultTotal + childTotal + addOnsTotal;
  const depositAmount = Math.ceil(grandTotal * (DEPOSIT_PERCENT / 100));
  const amountDue = state.paymentOption === "deposit" ? depositAmount : grandTotal;

  // Add-ons disabled — see notes near the `AddOnId` type above.
  // const toggleAddOn = (id: AddOnId) => {
  //   setState((prev) => {
  //     const s = new Set(prev.addOns);
  //     if (s.has(id)) { s.delete(id); } else { s.add(id); }
  //     return { ...prev, addOns: s };
  //   });
  // };

  const [bookingRef, setBookingRef] = useState("");

  const submitBooking = async () => {
    if (!state.agreeTerms || !selectedDep) return;
    setIsSubmitting(true);
    setBookingError(false);
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          departureId: selectedDep.id,
          departureDate: formatShortDate(selectedDep.date),
          returnDate: formatShortDate(selectedDep.endDate),
          guide: selectedDep.guide,
          tourName: serverData?.tourTitle ?? "Peaks of the Balkans",
          adults: state.adults,
          children: state.children,
          addOns: Array.from(state.addOns).map((id) => bookingAddOns.find((a) => a.id === id)?.name ?? id),
          totalPrice: grandTotal,
          paymentOption: state.paymentOption,
          paymentAmount: amountDue,
          firstName: state.firstName,
          lastName: state.lastName,
          email: state.email,
          phone: state.phone,
          dietary: state.dietary,
          fitness: state.fitness,
          emergencyName: state.emergencyName,
          emergencyPhone: state.emergencyPhone,
        }),
      });
      const data = await res.json();
      if (res.ok && data.bookingRef) {
        setBookingRef(data.bookingRef);
        setConfirmed(true);
      } else {
        setBookingError(true);
      }
    } catch {
      setBookingError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (confirmed) {
    const confirmedPaymentLabel = state.paymentOption === "deposit"
      ? `${DEPOSIT_PERCENT}% deposit`
      : "full payment";
    return (
      <div className="max-w-2xl mx-auto py-8">
        {/* Status badge */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-14 h-14 rounded-full bg-forest flex items-center justify-center shrink-0">
            <Check className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-mono text-xs text-terra tracking-[0.12em] uppercase mb-0.5">Spot Reserved</div>
            <h1 className="font-fraunces text-3xl font-bold tracking-tight">Almost there — send your transfer</h1>
          </div>
        </div>

        {/* Booking ref */}
        <div className="bg-dark text-white rounded-2xl px-6 py-5 mb-6">
          <div className="font-mono text-[10px] text-amber-400 tracking-[0.14em] uppercase mb-1.5">Booking Reference</div>
          <div className="font-mono text-2xl font-bold tracking-wider mb-1">{bookingRef}</div>
          <div className="font-mono text-xs text-white/40">A copy has been sent to {state.email}</div>
        </div>

        {/* Bank transfer instructions */}
        <div className="bg-white border-2 border-divider rounded-2xl overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-divider flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-brand" strokeWidth={1.5} />
            <div>
              <div className="font-semibold text-[15px]">Bank Transfer Details</div>
              <div className="text-xs text-ink/45 mt-0.5">Please transfer your {confirmedPaymentLabel} to secure your spot</div>
            </div>
          </div>
          <BankRow label="Account holder" value={BANK.accountHolder} />
          <BankRow label="Bank" value={BANK.bank} />
          <BankRow label="IBAN" value={BANK.iban} copyable />
          <BankRow label="BIC / SWIFT" value={BANK.bic} copyable />
          <BankRow label="Currency" value={BANK.currency} />
          <BankRow label="Reference" value={BANK.referenceTemplate(bookingRef)} copyable highlight />
          <div className="px-6 py-4 bg-amber-50 border-t border-amber-200">
            <p className="text-sm text-amber-800 font-medium">
              Amount due:{" "}
              <span className="font-fraunces text-lg font-bold">
                {formatPrice(amountDue)}
              </span>
              {state.paymentOption === "deposit" && (
                <span className="text-amber-700 font-normal ml-1">(remaining {formatPrice(grandTotal - amountDue)} due 30 days before departure)</span>
              )}
            </p>
          </div>
        </div>

        {/* What happens next */}
        <div className="bg-bone border-2 border-divider rounded-2xl p-6 mb-6">
          <div className="font-mono text-[11px] text-terra tracking-[0.12em] uppercase mb-4">What happens next</div>
          <ol className="space-y-3">
            {[
              "Transfer your payment using the details above — include your booking reference.",
              "We'll confirm your booking within 24 hours of receiving payment.",
              "You'll receive your full pre-trip info pack once payment is verified.",
              "Your guide will message you on WhatsApp to introduce themselves.",
            ].map((text, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-ink/70">
                <span className="flex w-6 h-6 shrink-0 items-center justify-center rounded-full bg-dark font-mono text-xs font-bold text-white mt-0.5">
                  {i + 1}
                </span>
                {text}
              </li>
            ))}
          </ol>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href="https://wa.me/38348300155"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white no-underline transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#25D366" }}
          >
            WhatsApp us
          </a>
          <Link href="/" className="flex items-center gap-2 border-2 border-divider text-ink px-5 py-3 rounded-xl text-sm font-medium no-underline hover:border-ink transition-colors">
            Back to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
    <BookingSteps step={step} />
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-12 items-start">
      {/* Main panel */}
      <div>
        {/* Step 1 — Departure */}
        {step === 0 && (
          <div>
            <div className="font-mono text-[11px] text-terra tracking-[0.12em] uppercase mb-2">Step 1</div>
            <h2 className="font-fraunces text-3xl font-bold tracking-tight mb-1.5">Select Departure</h2>
            <p className="text-[15px] text-ink/55 mb-9">Choose your start date — availability is real-time.</p>

            <div className="flex flex-col gap-3">
              {availableDates.map((dep) => (
                <button
                  key={dep.id}
                  onClick={() => setState((p) => ({ ...p, departureId: dep.id }))}
                  className={`w-full text-left p-5 rounded-xl border-2 cursor-pointer transition-all bg-transparent ${
                    state.departureId === dep.id
                      ? "border-terra bg-terra/5"
                      : "border-divider bg-white hover:border-ink/30"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-mono text-sm font-medium mb-0.5">
                        {formatShortDate(dep.date)} – {formatShortDate(dep.endDate)}
                      </div>
                      <div className="text-[13px] text-ink/50">
                        Guide: {dep.guide} · {dep.spots}/{dep.total} spots left
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {dep.low && (
                        <span className="font-mono text-[10px] bg-gold text-ink px-2 py-0.5 rounded font-medium">Low</span>
                      )}
                      <div className="font-fraunces text-xl font-bold">{formatPrice(dep.price)}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 — Travellers */}
        {step === 1 && (
          <div>
            <div className="font-mono text-[11px] text-terra tracking-[0.12em] uppercase mb-2">Step 2</div>
            <h2 className="font-fraunces text-3xl font-bold tracking-tight mb-1.5">Travellers</h2>
            <p className="text-[15px] text-ink/55 mb-9">Children under 16 receive a 15% discount.</p>

            <div className="border-t-2 border-divider">
              {[
                { label: "Adults", sub: "16 and over", key: "adults" as const, min: 1 },
                { label: "Children", sub: "Under 16 (15% off)", key: "children" as const, min: 0 },
              ].map((row) => (
                <div key={row.key} className="flex items-center justify-between py-5 border-b border-divider">
                  <div>
                    <div className="text-base font-semibold mb-0.5">{row.label}</div>
                    <div className="text-[13px] text-ink/45">{row.sub}</div>
                  </div>
                  <div className="flex items-center border-2 border-divider rounded-xl overflow-hidden">
                    <button
                      onClick={() => setState((p) => ({ ...p, [row.key]: Math.max(row.min, p[row.key] - 1) }))}
                      className="w-11 h-11 bg-transparent border-none text-xl text-ink flex items-center justify-center cursor-pointer hover:bg-ink/5 transition-colors"
                      disabled={state[row.key] <= row.min}
                    >
                      −
                    </button>
                    <span className="w-12 text-center font-mono text-lg font-medium border-x-[1.5px] border-divider leading-[44px]">
                      {state[row.key]}
                    </span>
                    <button
                      onClick={() => setState((p) => ({ ...p, [row.key]: p[row.key] + 1 }))}
                      className="w-11 h-11 bg-transparent border-none text-xl text-ink flex items-center justify-center cursor-pointer hover:bg-ink/5 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white border-2 border-divider rounded-xl p-6 mt-2">
              {state.adults > 0 && (
                <div className="flex justify-between text-sm py-1.5 border-b border-divider">
                  <span>{state.adults}× Adult @ {formatPrice(basePrice)}</span>
                  <span>{formatPrice(adultTotal)}</span>
                </div>
              )}
              {state.children > 0 && (
                <div className="flex justify-between text-sm py-1.5 border-b border-divider">
                  <span>{state.children}× Child @ {formatPrice(Math.round(basePrice * 0.85))}</span>
                  <span>{formatPrice(childTotal)}</span>
                </div>
              )}
              <div className="flex justify-between font-fraunces text-xl font-bold pt-3">
                <span>Total (so far)</span>
                <span>{formatPrice(adultTotal + childTotal)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 3 — Add-ons (temporarily disabled, see notes near the `AddOnId` type above)
        {step === 2 && (
          <div>
            <div className="font-mono text-[11px] text-terra tracking-[0.12em] uppercase mb-2">Step 3</div>
            <h2 className="font-fraunces text-3xl font-bold tracking-tight mb-1.5">Add-ons</h2>
            <p className="text-[15px] text-ink/55 mb-9">Optional extras to make your trip easier.</p>

            <div className="flex flex-col gap-3.5">
              {bookingAddOns.map((addon) => {
                const selected = state.addOns.has(addon.id);
                const Icon = { backpack: Backpack, car: Car, bed: BedDouble }[addon.icon];
                const unit = { "per-day": "/day", "per-person": "/person", flat: "" }[addon.priceType];
                return (
                  <button
                    key={addon.id}
                    onClick={() => toggleAddOn(addon.id)}
                    className={`flex items-start gap-[18px] p-6 rounded-xl border-2 cursor-pointer text-left transition-all bg-transparent w-full ${
                      selected ? "border-forest bg-forest/4" : "border-divider bg-white hover:border-forest/40"
                    }`}
                  >
                    <div className={`w-5.5 h-5.5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${selected ? "bg-forest border-forest" : "border-divider"}`}>
                      {selected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                    </div>
                    <Icon className="w-5 h-5 text-forest flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                    <div className="flex-1">
                      <div className="text-[15px] font-semibold mb-0.5">{addon.name}</div>
                      <div className="text-[13px] text-ink/55 leading-[1.5]">{addon.description}</div>
                    </div>
                    <div className="font-fraunces text-xl font-bold whitespace-nowrap">
                      {formatPrice(addon.price)}<small className="font-inter text-xs font-normal text-ink/45">{unit}</small>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )} */}

        {/* Step 3 — Details */}
        {step === 2 && (
          <div>
            <div className="font-mono text-[11px] text-terra tracking-[0.12em] uppercase mb-2">Step 3</div>
            <h2 className="font-fraunces text-3xl font-bold tracking-tight mb-1.5">Your Details</h2>
            <p className="text-[15px] text-ink/55 mb-9">Lead traveller information for the booking.</p>

            <h3 className="font-fraunces text-xl font-bold mb-4">Lead traveller</h3>
            <div className="grid grid-cols-2 gap-[18px] mb-8">
              {[
                { label: "First name", key: "firstName", type: "text", span: false },
                { label: "Last name", key: "lastName", type: "text", span: false },
                { label: "Email address", key: "email", type: "email", span: true },
                { label: "Phone number", key: "phone", type: "tel", span: true },
                { label: "Dietary requirements", key: "dietary", type: "text", span: true },
              ].map((f) => (
                <div key={f.key} className={f.span ? "col-span-2" : ""}>
                  <label className="text-[13px] font-semibold block mb-1.5">{f.label}</label>
                  <input
                    type={f.type}
                    value={state[f.key as keyof BookingState] as string}
                    onChange={(e) => setState((p) => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full px-3.5 py-[11px] border-2 border-divider rounded-lg font-inter text-[15px] bg-white text-ink outline-none focus:border-forest transition-colors"
                  />
                </div>
              ))}
            </div>

            <h3 className="font-fraunces text-xl font-bold mb-4 pt-8 border-t-2 border-divider">Emergency contact</h3>
            <div className="grid grid-cols-2 gap-[18px] mb-8">
              {[
                { label: "Name", key: "emergencyName" },
                { label: "Phone", key: "emergencyPhone" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="text-[13px] font-semibold block mb-1.5">{f.label}</label>
                  <input
                    type="text"
                    value={state[f.key as keyof BookingState] as string}
                    onChange={(e) => setState((p) => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full px-3.5 py-[11px] border-2 border-divider rounded-lg font-inter text-[15px] bg-white text-ink outline-none focus:border-forest transition-colors"
                  />
                </div>
              ))}
            </div>

            <h3 className="font-fraunces text-xl font-bold mb-4 pt-8 border-t-2 border-divider">Fitness self-assessment</h3>
            <div className="flex flex-col gap-2.5">
              {[
                { value: "active", label: "Regularly active", desc: "I hike or exercise 3+ times per week" },
                { value: "moderate", label: "Moderately active", desc: "I exercise occasionally but haven't done multi-day hiking" },
                { value: "training", label: "Training for this", desc: "I'm specifically preparing for this trip" },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-start gap-3.5 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    state.fitness === opt.value ? "border-forest bg-forest/4" : "border-divider bg-white hover:border-forest/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="fitness"
                    value={opt.value}
                    checked={state.fitness === opt.value}
                    onChange={() => setState((p) => ({ ...p, fitness: opt.value }))}
                    className="mt-0.5 accent-forest w-4 h-4 flex-shrink-0"
                  />
                  <div>
                    <div className="text-sm font-semibold mb-0.5">{opt.label}</div>
                    <div className="text-[13px] text-ink/50">{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Step 4 — Review & Pay */}
        {step === 3 && (
          <div>
            <div className="font-mono text-[11px] text-terra tracking-[0.12em] uppercase mb-2">Step 4</div>
            <h2 className="font-fraunces text-3xl font-bold tracking-tight mb-1.5">Review &amp; Pay</h2>
            <p className="text-[15px] text-ink/55 mb-9">Check your booking details before payment.</p>

            <BookingPolicySummary />

            <div className="bg-white border-2 border-divider rounded-xl overflow-hidden mb-6">
              <div className="px-6 py-5 border-b border-divider">
                <div className="font-fraunces text-xl font-bold">Peaks of the Balkans</div>
                <div className="text-sm text-ink/50 mt-1">
                  {selectedDep ? `${formatShortDate(selectedDep.date)} – ${formatShortDate(selectedDep.endDate)}` : "—"} · {state.adults} adult{state.adults !== 1 ? "s" : ""}
                  {state.children > 0 ? `, ${state.children} child${state.children !== 1 ? "ren" : ""}` : ""}
                </div>
              </div>
              <div className="px-6 py-4">
                <div className="flex justify-between text-sm py-2 border-b border-divider">
                  <span>Adults ({state.adults}× {formatPrice(basePrice)})</span>
                  <span>{formatPrice(adultTotal)}</span>
                </div>
                {state.children > 0 && (
                  <div className="flex justify-between text-sm py-2 border-b border-divider">
                    <span>Children ({state.children}×)</span>
                    <span>{formatPrice(childTotal)}</span>
                  </div>
                )}
                {/* Add-ons line items disabled — see notes near the `AddOnId` type above.
                {bookingAddOns.filter((addon) => state.addOns.has(addon.id)).map((addon) => (
                  <div key={addon.id} className="flex justify-between text-sm py-2 border-b border-divider">
                    <span>{addon.name}{addon.priceType === "per-day" ? ` (${GEAR_RENTAL_DAYS} days)` : ""}</span>
                    <span>
                      {formatPrice(
                        addon.priceType === "per-day" ? addon.price * GEAR_RENTAL_DAYS
                        : addon.priceType === "per-person" ? addon.price * (state.adults + state.children)
                        : addon.price
                      )}
                    </span>
                  </div>
                ))} */}
                <div className="flex justify-between font-fraunces text-2xl font-bold pt-4">
                  <span>Total</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </div>

            <CancellationTimeline departureDate={selectedDep?.date} />

            <div className="border-t border-mist pt-6 space-y-3 mb-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={state.agreeTerms}
                  onChange={(e) => setState((p) => ({ ...p, agreeTerms: e.target.checked }))}
                  className="mt-1 w-5 h-5 accent-brand flex-shrink-0"
                />
                <span className="text-sm text-ink leading-relaxed">
                  I have read and agree to the{" "}
                  <Link href="/legal/booking-terms" target="_blank" className="text-brand underline underline-offset-2">
                    Booking Terms &amp; Conditions
                  </Link>
                  {" "}and the{" "}
                  <Link href="/legal/privacy-policy" target="_blank" className="text-brand underline underline-offset-2">
                    Privacy Policy
                  </Link>
                  . I understand the cancellation policy and the inherent risks of adventure travel.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={state.agreeHealth}
                  onChange={(e) => setState((p) => ({ ...p, agreeHealth: e.target.checked }))}
                  className="mt-1 w-5 h-5 accent-brand flex-shrink-0"
                />
                <span className="text-sm text-ink leading-relaxed">
                  I confirm I am physically and medically fit to participate, and I have disclosed any
                  relevant medical conditions or dietary requirements.
                </span>
              </label>
            </div>

            {/* Payment option toggle */}
            <div className="mb-6">
              <div className="text-sm font-semibold mb-3">How much would you like to pay now?</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setState((p) => ({ ...p, paymentOption: "deposit" }))}
                  className={`p-4 rounded-xl border-2 text-left cursor-pointer transition-all bg-transparent ${
                    state.paymentOption === "deposit" ? "border-brand bg-brand/5" : "border-divider bg-white hover:border-ink/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="text-xs font-mono font-semibold uppercase tracking-wider text-terra">
                      {DEPOSIT_PERCENT}% Deposit
                    </div>
                    {state.paymentOption === "deposit" && (
                      <div className="w-4 h-4 rounded-full bg-brand flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <div className="font-fraunces text-2xl font-bold">{formatPrice(depositAmount)}</div>
                  <div className="text-xs text-ink/45 mt-1">Remaining {formatPrice(grandTotal - depositAmount)} due 30 days before departure</div>
                </button>
                <button
                  type="button"
                  onClick={() => setState((p) => ({ ...p, paymentOption: "full" }))}
                  className={`p-4 rounded-xl border-2 text-left cursor-pointer transition-all bg-transparent ${
                    state.paymentOption === "full" ? "border-brand bg-brand/5" : "border-divider bg-white hover:border-ink/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="text-xs font-mono font-semibold uppercase tracking-wider text-terra">
                      Full Payment
                    </div>
                    {state.paymentOption === "full" && (
                      <div className="w-4 h-4 rounded-full bg-brand flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <div className="font-fraunces text-2xl font-bold">{formatPrice(grandTotal)}</div>
                  <div className="text-xs text-ink/45 mt-1">Pay everything now, nothing more to worry about</div>
                </button>
              </div>
            </div>

            {/* Bank transfer notice */}
            <div className="bg-bone border-2 border-divider rounded-xl p-5 mb-6 flex items-start gap-3">
              <Building2 className="w-5 h-5 text-brand shrink-0 mt-0.5" strokeWidth={1.5} />
              <div className="text-sm">
                <p className="font-semibold text-ink mb-0.5">Payment by bank transfer only</p>
                <p className="text-ink/55 leading-relaxed">
                  After you confirm, we&apos;ll send you the bank transfer details. Your spot is reserved for <strong>48 hours</strong> while your payment is processed. We&apos;ll confirm your booking within 24 hours of receiving it.
                </p>
              </div>
            </div>

            {bookingError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
                Something went wrong processing your booking. Please try again or message us on WhatsApp.
              </p>
            )}
            <button
              onClick={submitBooking}
              disabled={!state.agreeTerms || isSubmitting}
              className={`w-full py-4 rounded-xl font-bold text-[15px] border-none cursor-pointer transition-opacity ${
                state.agreeTerms && !isSubmitting
                  ? "bg-brand text-white hover:opacity-90"
                  : "bg-brand/40 text-white cursor-not-allowed"
              }`}
            >
              {isSubmitting
                ? "Reserving your spot…"
                : `Reserve Spot · Pay ${formatPrice(amountDue)} by Transfer`}
            </button>
            <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-ink/35">
              <Lock className="w-3 h-3" strokeWidth={1.5} />
              Booking confirmed within 24 hours of receiving payment
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t-2 border-divider">
          <button
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-divider text-sm font-medium bg-transparent cursor-pointer hover:border-ink transition-colors ${step === 0 ? "opacity-0 pointer-events-none" : ""}`}
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
            Back
          </button>

          {step < 3 && (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={step === 0 && !state.departureId}
              className="flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-xl text-sm font-semibold border-none cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              Continue
              <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>

      {/* Sidebar summary */}
      <div className="lg:sticky lg:top-[148px] bg-white border-2 border-divider rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-divider">
          <div className="font-mono text-[11px] text-terra tracking-[0.1em] uppercase mb-1">Your booking</div>
          <div className="font-fraunces text-xl font-bold">Peaks of the Balkans</div>
        </div>
        <div className="px-6 py-5 text-[13px] space-y-2">
          <div className="flex justify-between text-ink/50">
            <span>Departure</span>
            <span className="font-medium text-ink">
              {selectedDep ? formatShortDate(selectedDep.date) : "—"}
            </span>
          </div>
          <div className="flex justify-between text-ink/50">
            <span>Travellers</span>
            <span className="font-medium text-ink">
              {state.adults} adult{state.adults !== 1 ? "s" : ""}
              {state.children > 0 ? ` + ${state.children} child${state.children !== 1 ? "ren" : ""}` : ""}
            </span>
          </div>
          {/* Add-ons summary disabled — see notes near the `addOns` catalog above.
          {state.addOns.size > 0 && (
            <div className="flex justify-between text-ink/50">
              <span>Add-ons</span>
              <span className="font-medium text-ink">{state.addOns.size}</span>
            </div>
          )} */}
        </div>
        <div className="px-6 py-4 bg-ink/[0.02] border-t border-divider">
          <div className="flex justify-between font-fraunces text-2xl font-bold">
            <span>Total</span>
            <span>{formatPrice(grandTotal)}</span>
          </div>
          {step === 3 && grandTotal > 0 && (
            <div className="flex justify-between text-sm text-brand font-semibold mt-1.5">
              <span>Due now ({state.paymentOption === "deposit" ? `${DEPOSIT_PERCENT}% deposit` : "full"})</span>
              <span>{formatPrice(amountDue)}</span>
            </div>
          )}
          <div className="text-[12px] text-ink/35 mt-1">Incl. all taxes &amp; fees</div>
        </div>
      </div>
    </div>
    </>
  );
}

// ─── Helper: copyable bank transfer row ──────────────────────────────────────
function BankRow({
  label,
  value,
  copyable = false,
  highlight = false,
}: {
  label: string;
  value: string;
  copyable?: boolean;
  highlight?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex items-center justify-between px-6 py-3.5 border-b border-divider last:border-b-0 ${highlight ? "bg-brand/[0.04]" : ""}`}>
      <div>
        <div className="font-mono text-[10px] uppercase tracking-wider text-ink/40 mb-0.5">{label}</div>
        <div className={`font-mono text-sm font-semibold ${highlight ? "text-brand" : "text-ink"}`}>{value}</div>
      </div>
      {copyable && (
        <button
          onClick={copy}
          type="button"
          className="flex items-center gap-1 text-xs text-ink/40 hover:text-brand transition-colors cursor-pointer bg-transparent border-none p-1 rounded"
          aria-label={`Copy ${label}`}
        >
          {copied ? (
            <CheckCheck className="w-4 h-4 text-forest" strokeWidth={2} />
          ) : (
            <Copy className="w-4 h-4" strokeWidth={1.5} />
          )}
        </button>
      )}
    </div>
  );
}
