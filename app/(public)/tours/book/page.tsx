import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, Lock } from "lucide-react";
import { BookingWizard, type BookingWizardServerData } from "@/components/booking/BookingWizard";
import { db } from "@/lib/db/client";
import { tours, departures, guides } from "@/lib/db/schema";
import { and, asc, eq, sql } from "drizzle-orm";

export const metadata: Metadata = {
  title: "Book — Peaks of the Balkans",
  description: "Book your spot on the Peaks of the Balkans guided trek.",
};

async function getBookingServerData(slug: string): Promise<BookingWizardServerData | null> {
  try {
    const [tour] = await db
      .select({
        id: tours.id,
        title: tours.title,
        pricePerPersonEur: tours.pricePerPersonEur,
      })
      .from(tours)
      .where(and(eq(tours.slug, slug), eq(tours.published, true)))
      .limit(1);

    if (!tour) return null;

    const today = new Date().toISOString().split("T")[0];
    const departuresRows = await db
      .select({
        id: departures.id,
        startDate: departures.startDate,
        endDate: departures.endDate,
        capacity: departures.capacity,
        bookedCount: departures.bookedCount,
        pricePerPersonEur: departures.pricePerPersonEur,
        guideName: guides.name,
      })
      .from(departures)
      .leftJoin(guides, eq(departures.guideId, guides.id))
      .where(
        and(
          eq(departures.tourId, tour.id),
          sql`${departures.startDate} >= ${today}`,
          sql`${departures.status} != 'CANCELLED'`
        )
      )
      .orderBy(asc(departures.startDate));

    return {
      tourTitle: tour.title,
      basePrice: Number(tour.pricePerPersonEur ?? 1290),
      departures: departuresRows.map((dep) => ({
        id: String(dep.id),
        date: String(dep.startDate),
        endDate: String(dep.endDate),
        guide: dep.guideName ?? "TBC",
        spots: Number(dep.capacity) - Number(dep.bookedCount ?? 0),
        total: Number(dep.capacity),
        price: dep.pricePerPersonEur ? Number(dep.pricePerPersonEur) : Number(tour.pricePerPersonEur ?? 1290),
        low: Number(dep.capacity) - Number(dep.bookedCount ?? 0) <= 3,
      })),
    };
  } catch {
    return null;
  }
}

export default async function BookPage({ searchParams }: { searchParams: Promise<{ tour?: string }> }) {
  const params = await searchParams;
  const slug = params.tour?.trim() || "peaks-of-the-balkans";
  const serverData = await getBookingServerData(slug);

  return (
    <div className="min-h-screen bg-bone">
      {/* Booking nav */}
      <header className="fixed top-0 left-0 right-0 z-[100] h-16 px-6 md:px-10 flex items-center justify-between bg-bone border-b-2 border-divider">
        <Link href="/" className="flex items-center no-underline">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Summit Balkans" width={148} height={36} className="h-8 w-auto" />
        </Link>
        <Link
          href="/tours"
          className="flex items-center gap-1.5 text-sm text-ink/50 no-underline hover:text-ink transition-colors"
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
          Back to tours
        </Link>
        <div className="flex items-center gap-1.5 text-[13px] text-ink/45">
          <Lock className="w-3.5 h-3.5" strokeWidth={1.5} />
          Secured checkout
        </div>
      </header>

      {/* Content — BookingWizard renders its own fixed step bar below the header */}
      <div className="max-w-[1100px] mx-auto px-6 md:px-10 pb-20" style={{ paddingTop: "162px" }}>
        <BookingWizard tourSlug={slug} serverData={serverData} />
      </div>
    </div>
  );
}
