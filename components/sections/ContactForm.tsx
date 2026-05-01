"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { contactSchema, type ContactFormData } from "@/lib/schemas";

const subjects = [
  { value: "booking", label: "Tour booking question" },
  { value: "private", label: "Private trip enquiry" },
  { value: "gear", label: "Gear rental" },
  { value: "general", label: "General question" },
];

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setServerError(false);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setSubmitted(true);
    } else {
      setServerError(true);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="w-14 h-14 rounded-full bg-forest flex items-center justify-center mx-auto mb-5">
          <Check className="w-7 h-7 text-white" strokeWidth={2} />
        </div>
        <h3 className="font-fraunces text-2xl font-bold mb-2">Message sent!</h3>
        <p className="text-ink/55">We&apos;ll get back to you within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="text-[13px] font-semibold block mb-1.5">Your name *</label>
          <input
            {...register("name")}
            type="text"
            className="w-full px-3.5 py-[11px] border-2 border-divider rounded-lg font-inter text-[15px] bg-white outline-none focus:border-forest transition-colors"
          />
          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="text-[13px] font-semibold block mb-1.5">Email address *</label>
          <input
            {...register("email")}
            type="email"
            className="w-full px-3.5 py-[11px] border-2 border-divider rounded-lg font-inter text-[15px] bg-white outline-none focus:border-forest transition-colors"
          />
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <label className="text-[13px] font-semibold block mb-1.5">Phone (optional)</label>
        <input
          {...register("phone")}
          type="tel"
          className="w-full px-3.5 py-[11px] border-2 border-divider rounded-lg font-inter text-[15px] bg-white outline-none focus:border-forest transition-colors"
        />
      </div>

      <div>
        <label className="text-[13px] font-semibold block mb-1.5">Subject *</label>
        <select
          {...register("subject")}
          className="w-full px-3.5 py-[11px] border-2 border-divider rounded-lg font-inter text-[15px] bg-white outline-none focus:border-forest transition-colors appearance-none"
          defaultValue=""
        >
          <option value="" disabled>Select a subject…</option>
          {subjects.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        {errors.subject && <p className="text-xs text-red-600 mt-1">{errors.subject.message}</p>}
      </div>

      <div>
        <label className="text-[13px] font-semibold block mb-1.5">Message *</label>
        <textarea
          {...register("message")}
          rows={5}
          className="w-full px-3.5 py-[11px] border-2 border-divider rounded-lg font-inter text-[15px] bg-white resize-y outline-none focus:border-forest transition-colors"
          placeholder="Tell us what you'd like to know…"
        />
        {errors.message && <p className="text-xs text-red-600 mt-1">{errors.message.message}</p>}
      </div>

      {serverError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          Something went wrong. Please try again or message us on WhatsApp.
        </p>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-terra text-white px-8 py-4 rounded-xl font-semibold text-[15px] border-none cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
