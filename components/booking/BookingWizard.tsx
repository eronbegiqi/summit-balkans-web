"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Check, ChevronLeft, ChevronRight, Lock, Backpack, Car, BedDouble } from "lucide-react";
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

const addOns = [
  { id: "gear", icon: Backpack, title: "Gear Rental Pack", desc: "Trekking poles, sleeping bag, daypack & headlamp for your whole trip.", price: 45, unit: "/day" },
  { id: "transfer", icon: Car, title: "Airport Transfer", desc: "Private transfer from Prishtina, Tirana, or Podgorica airport.", price: 35, unit: "/person" },
  { id: "single", icon: BedDouble, title: "Single Supplement", desc: "Guaranteed private room throughout (subject to availability).", price: 180, unit: "" },
];

type AddOnId = "gear" | "transfer" | "single";

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
  agreeTerms: boolean;
  agreeHealth: boolean;
}

function formatShortDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function BookingWizard({ tourSlug = "peaks-of-the-balkans" }: { tourSlug?: string }) {
  const [step, setStep] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [bookingError, setBookingError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableDates, setAvailableDates] = useState<Departure[]>(FALLBACK_DATES);

  // Fetch real departures from DB on mount; keep fallback if unavailable
  useEffect(() => {
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
  }, [tourSlug]);

  const [state, setState] = useState<BookingState>({
    departureId: null,
    adults: 1,
    children: 0,
    addOns: new Set(),
    firstName: "", lastName: "", email: "", phone: "",
    dietary: "", emergencyName: "", emergencyPhone: "", fitness: "",
    agreeTerms: false,
    agreeHealth: false,
  });

  const selectedDep = availableDates.find((d) => d.id === state.departureId) ?? null;
  const basePrice = selectedDep?.price ?? 1290;
  const adultTotal = basePrice * state.adults;
  const childTotal = Math.round(basePrice * 0.85) * state.children;
  const gearTotal = state.addOns.has("gear") ? 45 * 10 : 0;
  const transferTotal = state.addOns.has("transfer") ? 35 * (state.adults + state.children) : 0;
  const singleTotal = state.addOns.has("single") ? 180 : 0;
  const grandTotal = adultTotal + childTotal + gearTotal + transferTotal + singleTotal;

  const toggleAddOn = (id: AddOnId) => {
    setState((prev) => {
      const s = new Set(prev.addOns);
      if (s.has(id)) { s.delete(id); } else { s.add(id); }
      return { ...prev, addOns: s };
    });
  };

  const [bookingRef, setBookingRef] = useState("");

  const submitBooking = async () => {
    if (!state.agreeTerms || !selectedDep) return;
    setIsSubmitting(true);
    setBookingError(false);
    const addOnLabels: Record<string, string> = {
      gear: "Gear Rental Pack", transfer: "Airport Transfer", single: "Single Supplement",
    };
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          departureId: selectedDep.id,
          departureDate: formatShortDate(selectedDep.date),
          returnDate: formatShortDate(selectedDep.endDate),
          guide: selectedDep.guide,
          tourName: "Peaks of the Balkans",
          adults: state.adults,
          children: state.children,
          addOns: Array.from(state.addOns).map((id) => addOnLabels[id] ?? id),
          totalPrice: grandTotal,
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
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center max-w-lg px-6">
          <div className="w-20 h-20 rounded-full bg-forest flex items-center justify-center mx-auto mb-8">
            <Check className="w-10 h-10 text-white" strokeWidth={2} />
          </div>
          <div className="font-mono text-xs text-terra tracking-[0.12em] uppercase mb-3">Booking Confirmed</div>
          <h1 className="font-fraunces text-4xl font-bold tracking-tight mb-4">You&apos;re going!</h1>
          <div className="bg-dark text-white font-mono text-lg font-medium px-6 py-3 rounded-lg inline-block mb-6">
            {bookingRef}
          </div>
          <p className="text-ink/60 mb-8 leading-relaxed">
            Confirmation and pre-trip information has been sent to <strong>{state.email}</strong>. Your guide will be in touch within 48 hours.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/" className="bg-terra text-white px-6 py-3.5 rounded-xl font-semibold no-underline text-center hover:opacity-90">
              Back to Summit Balkans
            </Link>
            <a
              href="https://wa.me/38349279136"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-divider text-ink px-6 py-3.5 rounded-xl font-medium no-underline text-center hover:border-ink transition-colors"
            >
              Message Your Guide on WhatsApp
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-12 items-start" style={{ gridTemplateColumns: "1fr 360px" }}>
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
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-mono text-sm font-medium mb-0.5">
                        {formatShortDate(dep.date)} – {formatShortDate(dep.endDate)}
                      </div>
                      <div className="text-[13px] text-ink/50">
                        Guide: {dep.guide} · {dep.spots}/{dep.total} spots left
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
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

        {/* Step 3 — Add-ons */}
        {step === 2 && (
          <div>
            <div className="font-mono text-[11px] text-terra tracking-[0.12em] uppercase mb-2">Step 3</div>
            <h2 className="font-fraunces text-3xl font-bold tracking-tight mb-1.5">Add-ons</h2>
            <p className="text-[15px] text-ink/55 mb-9">Optional extras to make your trip easier.</p>

            <div className="flex flex-col gap-3.5">
              {addOns.map((addon) => {
                const selected = state.addOns.has(addon.id as AddOnId);
                const Icon = addon.icon;
                return (
                  <button
                    key={addon.id}
                    onClick={() => toggleAddOn(addon.id as AddOnId)}
                    className={`flex items-start gap-[18px] p-6 rounded-xl border-2 cursor-pointer text-left transition-all bg-transparent w-full ${
                      selected ? "border-forest bg-forest/4" : "border-divider bg-white hover:border-forest/40"
                    }`}
                  >
                    <div className={`w-5.5 h-5.5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${selected ? "bg-forest border-forest" : "border-divider"}`}>
                      {selected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                    </div>
                    <Icon className="w-5 h-5 text-forest flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                    <div className="flex-1">
                      <div className="text-[15px] font-semibold mb-0.5">{addon.title}</div>
                      <div className="text-[13px] text-ink/55 leading-[1.5]">{addon.desc}</div>
                    </div>
                    <div className="font-fraunces text-xl font-bold whitespace-nowrap">
                      {formatPrice(addon.price)}<small className="font-inter text-xs font-normal text-ink/45">{addon.unit}</small>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4 — Details */}
        {step === 3 && (
          <div>
            <div className="font-mono text-[11px] text-terra tracking-[0.12em] uppercase mb-2">Step 4</div>
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

        {/* Step 5 — Review & Pay */}
        {step === 4 && (
          <div>
            <div className="font-mono text-[11px] text-terra tracking-[0.12em] uppercase mb-2">Step 5</div>
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
                {state.addOns.has("gear") && (
                  <div className="flex justify-between text-sm py-2 border-b border-divider">
                    <span>Gear Rental Pack (10 days)</span>
                    <span>{formatPrice(gearTotal)}</span>
                  </div>
                )}
                {state.addOns.has("transfer") && (
                  <div className="flex justify-between text-sm py-2 border-b border-divider">
                    <span>Airport Transfer</span>
                    <span>{formatPrice(transferTotal)}</span>
                  </div>
                )}
                {state.addOns.has("single") && (
                  <div className="flex justify-between text-sm py-2 border-b border-divider">
                    <span>Single Supplement</span>
                    <span>{formatPrice(singleTotal)}</span>
                  </div>
                )}
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
                  ? "bg-terra text-white hover:opacity-90"
                  : "bg-terra/40 text-white cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "Confirming booking…" : `Pay ${formatPrice(grandTotal)} with Stripe`}
            </button>
            <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-ink/35">
              <Lock className="w-3 h-3" strokeWidth={1.5} />
              Secured by Stripe · SSL encrypted
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

          {step < 4 && (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={step === 0 && !state.departureId}
              className="flex items-center gap-2 bg-terra text-white px-6 py-3 rounded-xl text-sm font-semibold border-none cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              Continue
              <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>

      {/* Sidebar summary */}
      <div className="sticky top-[148px] bg-white border-2 border-divider rounded-2xl overflow-hidden">
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
          {state.addOns.size > 0 && (
            <div className="flex justify-between text-ink/50">
              <span>Add-ons</span>
              <span className="font-medium text-ink">{state.addOns.size}</span>
            </div>
          )}
        </div>
        <div className="px-6 py-4 bg-ink/[0.02] border-t border-divider">
          <div className="flex justify-between font-fraunces text-2xl font-bold">
            <span>Total</span>
            <span>{formatPrice(grandTotal)}</span>
          </div>
          <div className="text-[12px] text-ink/35 mt-1">Incl. all taxes &amp; fees</div>
        </div>
      </div>
    </div>
  );
}
