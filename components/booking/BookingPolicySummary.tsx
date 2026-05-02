import Link from "next/link";
import { Calendar, CreditCard, Shield, ArrowRight } from "lucide-react";

const items = [
  {
    icon: Calendar,
    title: "20% Deposit",
    desc: "Secures your spot. Non-refundable.",
  },
  {
    icon: CreditCard,
    title: "Full Payment",
    desc: "Due 30 days before departure date.",
  },
  {
    icon: Shield,
    title: "Insurance",
    desc: "Strongly recommended. Not included.",
  },
];

export function BookingPolicySummary() {
  return (
    <div className="border-2 border-divider rounded-xl bg-bone p-5 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {items.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon className="w-4 h-4 text-brand" strokeWidth={1.5} />
            </div>
            <div>
              <div className="text-sm font-semibold text-ink">{title}</div>
              <div className="text-[13px] text-ink/55 leading-snug">{desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-divider pt-3">
        <Link
          href="/legal/booking-terms"
          target="_blank"
          className="inline-flex items-center gap-1.5 text-[13px] text-brand no-underline hover:underline underline-offset-2 font-medium transition-colors"
        >
          Read full Booking Terms
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
        </Link>
      </div>
    </div>
  );
}
