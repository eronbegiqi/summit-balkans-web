"use client";

import { useState } from "react";
import { Check, ChevronRight, ChevronLeft } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";

const destinations = ["Albania", "Montenegro", "Kosovo", "Flexible"];
const experienceTypes = [
  { id: "day-hikes", label: "Day Hikes", image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&q=75" },
  { id: "multi-day", label: "Multi-day Trek", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=75" },
  { id: "camping", label: "Camping", image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&q=75" },
  { id: "mixed", label: "Mixed", image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&q=75" },
];

interface FormState {
  destinations: string[];
  dateOption: string;
  customFrom: string;
  customTo: string;
  groupSize: number;
  experiences: string[];
  name: string;
  email: string;
  phone: string;
  notes: string;
}

export function PrivateTripsForm() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormState>({
    destinations: [],
    dateOption: "",
    customFrom: "",
    customTo: "",
    groupSize: 4,
    experiences: [],
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  const toggleDest = (d: string) => {
    if (d === "Flexible") {
      setForm((p) => ({ ...p, destinations: ["Flexible"] }));
      return;
    }
    setForm((p) => ({
      ...p,
      destinations: p.destinations.includes(d)
        ? p.destinations.filter((x) => x !== d)
        : [...p.destinations.filter((x) => x !== "Flexible"), d],
    }));
  };

  const toggleExp = (e: string) =>
    setForm((p) => ({
      ...p,
      experiences: p.experiences.includes(e) ? p.experiences.filter((x) => x !== e) : [...p.experiences, e],
    }));

  if (submitted) {
    return (
      <section id="enquiry" className="py-24">
        <div className="max-w-content mx-auto px-10 max-w-2xl text-center">
          <div className="w-16 h-16 rounded-full bg-forest flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-white" strokeWidth={2} />
          </div>
          <h2 className="font-fraunces text-4xl font-bold tracking-tight mb-4">
            We&apos;ll be in touch within 24 hours.
          </h2>
          <p className="text-ink/55 mb-8">
            Thanks {form.name.split(" ")[0]}. We&apos;ve received your enquiry and will send a custom itinerary proposal within 24 hours.
          </p>
          <a
            href="https://cal.com/summitbalkans"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-forest text-white px-6 py-3.5 rounded-xl font-semibold no-underline hover:opacity-90 transition-opacity text-sm"
          >
            Or book a 15-min call
          </a>
        </div>
      </section>
    );
  }

  return (
    <section id="enquiry" className="py-24">
      <div className="max-w-content mx-auto px-10">
        <div
          className="grid gap-20 items-start"
          style={{ gridTemplateColumns: "1fr 420px" }}
        >
          {/* Form */}
          <div>
            <SectionLabel>Start Here</SectionLabel>
            <h2
              className="font-fraunces font-bold tracking-tight mb-12"
              style={{ fontSize: "clamp(30px, 3.5vw, 44px)" }}
            >
              Tell us about your trip
            </h2>

            {/* Progress dots */}
            <div className="flex gap-1.5 mb-10">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-[3px] flex-1 rounded-full transition-all duration-300 ${
                    i < step ? "bg-forest" : i === step ? "bg-terra" : "bg-divider"
                  }`}
                />
              ))}
            </div>

            {/* Q1 — Destination */}
            {step === 0 && (
              <div>
                <div className="font-mono text-[11px] text-terra tracking-[0.12em] uppercase mb-2.5">Question 1 of 5</div>
                <h3 className="font-fraunces text-[30px] font-bold tracking-tight mb-2 leading-[1.15]">
                  Where would you like to go?
                </h3>
                <p className="text-[15px] text-ink/50 mb-8">You can choose more than one.</p>
                <div className="flex gap-3 flex-wrap">
                  {destinations.map((d) => (
                    <button
                      key={d}
                      onClick={() => toggleDest(d)}
                      className={`px-5 py-3 rounded-xl border-2 text-[15px] font-medium cursor-pointer transition-all ${
                        form.destinations.includes(d)
                          ? "border-forest bg-forest/6 text-forest"
                          : "border-divider bg-white text-ink hover:border-forest/40"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Q2 — When */}
            {step === 1 && (
              <div>
                <div className="font-mono text-[11px] text-terra tracking-[0.12em] uppercase mb-2.5">Question 2 of 5</div>
                <h3 className="font-fraunces text-[30px] font-bold tracking-tight mb-2 leading-[1.15]">
                  When are you thinking?
                </h3>
                <p className="text-[15px] text-ink/50 mb-8">Choose a season or specific dates.</p>
                <div className="flex flex-col gap-2.5 mb-4">
                  {["Spring (Apr–May)", "Summer (Jun–Aug)", "Autumn (Sep–Oct)", "Flexible"].map((opt) => (
                    <label
                      key={opt}
                      className={`flex items-center gap-3.5 px-[18px] py-3.5 border-2 rounded-xl cursor-pointer transition-all bg-white ${
                        form.dateOption === opt ? "border-forest bg-forest/4" : "border-divider hover:border-forest/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name="dateopt"
                        value={opt}
                        checked={form.dateOption === opt}
                        onChange={() => setForm((p) => ({ ...p, dateOption: opt }))}
                        className="accent-forest w-4 h-4"
                      />
                      <span className="text-[15px] font-medium">{opt}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-2.5">
                  <input
                    type="date"
                    value={form.customFrom}
                    onChange={(e) => setForm((p) => ({ ...p, customFrom: e.target.value }))}
                    className="flex-1 px-3.5 py-[11px] border-2 border-divider rounded-lg font-inter text-sm bg-white outline-none focus:border-forest transition-colors"
                    placeholder="From"
                  />
                  <input
                    type="date"
                    value={form.customTo}
                    onChange={(e) => setForm((p) => ({ ...p, customTo: e.target.value }))}
                    className="flex-1 px-3.5 py-[11px] border-2 border-divider rounded-lg font-inter text-sm bg-white outline-none focus:border-forest transition-colors"
                    placeholder="To"
                  />
                </div>
              </div>
            )}

            {/* Q3 — Group size */}
            {step === 2 && (
              <div>
                <div className="font-mono text-[11px] text-terra tracking-[0.12em] uppercase mb-2.5">Question 3 of 5</div>
                <h3 className="font-fraunces text-[30px] font-bold tracking-tight mb-2 leading-[1.15]">
                  How many people?
                </h3>
                <p className="text-[15px] text-ink/50 mb-8">Private trips from 2 to 12 people.</p>
                <div
                  className="font-fraunces font-bold text-ink leading-[1] mb-1 tracking-[-0.04em]"
                  style={{ fontSize: "72px", fontVariationSettings: "'opsz' 72" }}
                >
                  {form.groupSize} <span className="text-2xl font-normal text-ink/40 font-inter">people</span>
                </div>
                <p className="text-sm text-ink/45 mb-6">Including yourself</p>
                <input
                  type="range"
                  min={2}
                  max={12}
                  value={form.groupSize}
                  onChange={(e) => setForm((p) => ({ ...p, groupSize: parseInt(e.target.value) }))}
                  className="w-full h-1 rounded bg-divider appearance-none accent-terra cursor-pointer"
                />
                <div className="flex justify-between font-mono text-[11px] text-ink/35 mt-2">
                  <span>2</span><span>12</span>
                </div>
              </div>
            )}

            {/* Q4 — Experience type */}
            {step === 3 && (
              <div>
                <div className="font-mono text-[11px] text-terra tracking-[0.12em] uppercase mb-2.5">Question 4 of 5</div>
                <h3 className="font-fraunces text-[30px] font-bold tracking-tight mb-2 leading-[1.15]">
                  What kind of experience?
                </h3>
                <p className="text-[15px] text-ink/50 mb-8">Select all that apply.</p>
                <div className="grid grid-cols-2 gap-3.5">
                  {experienceTypes.map((exp) => (
                    <button
                      key={exp.id}
                      onClick={() => toggleExp(exp.id)}
                      className={`rounded-xl overflow-hidden border-2 cursor-pointer text-left transition-all ${
                        form.experiences.includes(exp.id) ? "border-forest" : "border-divider hover:border-forest/40"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={exp.image} alt={exp.label} className="w-full h-[140px] object-cover block" loading="lazy" />
                      <div className="px-3.5 py-3 bg-white flex items-center justify-between text-sm font-semibold">
                        {exp.label}
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                          form.experiences.includes(exp.id) ? "bg-forest border-forest" : "border-divider"
                        }`}>
                          {form.experiences.includes(exp.id) && (
                            <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Q5 — Details */}
            {step === 4 && (
              <div>
                <div className="font-mono text-[11px] text-terra tracking-[0.12em] uppercase mb-2.5">Question 5 of 5</div>
                <h3 className="font-fraunces text-[30px] font-bold tracking-tight mb-2 leading-[1.15]">
                  Your details
                </h3>
                <p className="text-[15px] text-ink/50 mb-8">We&apos;ll use these to send you a custom proposal.</p>
                <div className="flex flex-col gap-4">
                  {[
                    { label: "Your name", key: "name", type: "text" },
                    { label: "Email address", key: "email", type: "email" },
                    { label: "Phone (WhatsApp preferred)", key: "phone", type: "tel" },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="text-[13px] font-semibold block mb-1.5">{f.label}</label>
                      <input
                        type={f.type}
                        value={form[f.key as keyof FormState] as string}
                        onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                        className="w-full px-3.5 py-3 border-2 border-divider rounded-lg font-inter text-[15px] bg-white outline-none focus:border-forest transition-colors"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="text-[13px] font-semibold block mb-1.5">Any notes or special requests</label>
                    <textarea
                      value={form.notes}
                      onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                      rows={3}
                      className="w-full px-3.5 py-3 border-2 border-divider rounded-lg font-inter text-[15px] bg-white resize-y outline-none focus:border-forest transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Nav */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t-2 border-divider">
              <button
                onClick={() => setStep((s) => s - 1)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-divider text-sm font-medium bg-transparent cursor-pointer hover:border-ink transition-colors ${step === 0 ? "opacity-0 pointer-events-none" : ""}`}
              >
                <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
                Back
              </button>

              {step < 4 ? (
                <button
                  onClick={() => setStep((s) => s + 1)}
                  className="flex items-center gap-2 bg-terra text-white px-6 py-3 rounded-xl text-sm font-semibold border-none cursor-pointer hover:opacity-90"
                >
                  Next
                  <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
                </button>
              ) : (
                <button
                  onClick={() => setSubmitted(true)}
                  className="bg-terra text-white px-6 py-3 rounded-xl text-sm font-semibold border-none cursor-pointer hover:opacity-90"
                >
                  Send Enquiry
                </button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="sticky top-24 bg-dark rounded-2xl p-8 text-white">
            <div className="font-mono text-[11px] text-white/35 tracking-[0.1em] uppercase mb-4">
              What&apos;s included
            </div>
            <ul className="list-none flex flex-col gap-2.5 text-sm text-white/65 mb-8">
              {[
                "Custom itinerary designed around you",
                "Expert local guide",
                "All accommodation arranged",
                "Meals as agreed",
                "Permits & logistics",
                "24-hour guide support",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-gold flex-shrink-0" strokeWidth={2} />
                  {item}
                </li>
              ))}
            </ul>

            <div className="border-t border-white/10 pt-6">
              <div className="font-mono text-[11px] text-white/35 tracking-[0.1em] uppercase mb-3">
                Indicative pricing
              </div>
              <div className="flex flex-col gap-2 text-sm text-white/50">
                <div className="flex justify-between">
                  <span>Day hike (2 pax)</span>
                  <span className="font-mono text-white/70">from €120/person</span>
                </div>
                <div className="flex justify-between">
                  <span>3-day trek</span>
                  <span className="font-mono text-white/70">from €350/person</span>
                </div>
                <div className="flex justify-between">
                  <span>10-day expedition</span>
                  <span className="font-mono text-white/70">from €990/person</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
