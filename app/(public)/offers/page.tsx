import type { Metadata } from "next";
import { getActiveDiscounts } from "@/lib/db/queries/discounts";
import { SectionLabel } from "@/components/ui/SectionLabel";
import {
  Users, GraduationCap, Clock, Heart, Share2, Tag,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Offers & Discounts — Summit Balkans",
  description:
    "Group discounts, early bird rates, student offers and more. Book your Balkan hiking adventure and save.",
};

const ICON_MAP: Record<string, React.ReactNode> = {
  users: <Users className="w-6 h-6" strokeWidth={1.5} />,
  "users-2": <Users className="w-6 h-6" strokeWidth={1.5} />,
  "graduation-cap": <GraduationCap className="w-6 h-6" strokeWidth={1.5} />,
  clock: <Clock className="w-6 h-6" strokeWidth={1.5} />,
  heart: <Heart className="w-6 h-6" strokeWidth={1.5} />,
  share2: <Share2 className="w-6 h-6" strokeWidth={1.5} />,
  tag: <Tag className="w-6 h-6" strokeWidth={1.5} />,
};

export default async function OffersPage() {
  const offers = await getActiveDiscounts();

  return (
    <>
      {/* Hero */}
      <section className="bg-dark pt-[100px] pb-20 overflow-hidden relative">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #2e8a57 0%, transparent 60%), radial-gradient(circle at 70% 50%, #D4A574 0%, transparent 60%)" }}
        />
        <div className="max-w-content mx-auto px-6 md:px-10 relative text-center">
          <SectionLabel light>Offers & Discounts</SectionLabel>
          <h1
            className="font-fraunces font-bold text-white tracking-tight mt-2 mb-4"
            style={{ fontSize: "clamp(36px, 5vw, 68px)", lineHeight: 1.05 }}
          >
            Adventure is better together.
          </h1>
          <p className="text-xl text-white/55 max-w-[520px] mx-auto">
            At Summit Balkans, we believe the best experiences are shared. Book with friends, book early, or join a group — and save.
          </p>
        </div>
      </section>

      {/* Offers grid */}
      <section className="py-20 bg-bone">
        <div className="max-w-content mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => {
              const isPercentage = offer.discountType === "PERCENTAGE";
              const discountLabel = isPercentage
                ? `${Number(offer.discountValue).toFixed(0)}% OFF`
                : `€${Number(offer.discountValue).toFixed(0)} OFF`;
              const needsContact = offer.requiresStudentProof || offer.requiresReferralCode;
              const icon = offer.icon ? (ICON_MAP[offer.icon] ?? ICON_MAP.tag) : ICON_MAP.tag;

              return (
                <div
                  key={offer.id}
                  className="bg-white rounded-2xl border-2 border-divider p-6 flex flex-col hover:border-brand transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-brand/8 text-brand flex items-center justify-center">
                      {icon}
                    </div>
                    <span className="font-mono text-sm font-bold bg-brand text-white px-3 py-1 rounded-full tracking-wide">
                      {discountLabel}
                    </span>
                  </div>

                  <h3 className="font-fraunces text-xl font-bold tracking-tight mb-1">{offer.name}</h3>
                  {offer.tagline && (
                    <p className="font-mono text-xs text-brand uppercase tracking-wider mb-3">{offer.tagline}</p>
                  )}
                  {offer.description && (
                    <p className="text-sm text-ink/65 leading-relaxed mb-5 flex-1">{offer.description}</p>
                  )}

                  <div className="mt-auto space-y-2">
                    {offer.minParticipants && (
                      <p className="text-xs text-ink/45 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" strokeWidth={1.5} />
                        Minimum {offer.minParticipants} participants
                      </p>
                    )}
                    {offer.earlyBirdDaysAhead && (
                      <p className="text-xs text-ink/45 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
                        Book {offer.earlyBirdDaysAhead}+ days before departure
                      </p>
                    )}
                    {offer.requiresStudentProof && (
                      <p className="text-xs text-ink/45">📋 Student ID required at confirmation</p>
                    )}
                    {offer.requiresReferralCode && (
                      <p className="text-xs text-ink/45">🔑 Referral code required</p>
                    )}

                    {needsContact ? (
                      <Link
                        href="/contact"
                        className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-brand no-underline hover:gap-2.5 transition-all"
                      >
                        Contact us to apply <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
                      </Link>
                    ) : (
                      <p className="mt-3 text-xs font-medium text-brand">✓ Applied automatically at checkout</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-14 bg-dark rounded-2xl p-8 md:p-12 text-center">
            <h2 className="font-fraunces text-3xl font-bold text-white mb-3">Ready to book?</h2>
            <p className="text-white/55 mb-6 max-w-md mx-auto">
              Discounts are applied automatically where eligible. Proof-required offers are confirmed after booking.
            </p>
            <Link
              href="/tours"
              className="inline-flex items-center gap-2 bg-brand text-white px-7 py-4 rounded-xl font-semibold no-underline hover:opacity-90 transition-opacity"
            >
              Browse Tours <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
