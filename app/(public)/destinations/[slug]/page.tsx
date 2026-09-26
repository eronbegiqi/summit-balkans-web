import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, MapPin, CalendarDays, Mountain } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { JsonLd } from "@/components/seo/JsonLd";
import { formatPrice } from "@/lib/utils";
import {
  getPublishedDestinations,
  getPublishedDestinationsForPages,
  getStagesAtPlace,
  normalizeHighlights,
} from "@/lib/db/queries/destinations";
import { getPublishedTourCards } from "@/lib/db/queries/tours";
import { SITE_URL, brandTitle, breadcrumbJsonLd, clampAtWord, ogBase } from "@/lib/seo";

export const revalidate = 300;

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=85";
const TYPE_LABEL = { COUNTRY: "Country", CITY: "Town", TRAIL_STOP: "Trail stop" } as const;

export async function generateStaticParams() {
  const rows = await getPublishedDestinations();
  return rows.map((d) => ({ slug: d.slug }));
}

async function getDestination(slug: string) {
  const all = await getPublishedDestinationsForPages();
  const destination = all.find((d) => d.slug === slug);
  return destination ? { destination, all } : null;
}

function defaultTitle(d: { name: string; country: string; destinationType: string | null }) {
  if (d.destinationType === "COUNTRY") return `Hiking in ${d.name}: Trails & Guided Treks`;
  return `${d.name}, ${d.country}: Hiking & Travel Guide`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getDestination(slug);
  if (!data) return { title: "Destination not found" };
  const d = data.destination;
  const title = d.seoTitle || defaultTitle(d);
  const raw = d.seoDescription || d.description;
  const description = raw ? clampAtWord(raw) : undefined;
  return {
    title: brandTitle(title),
    description,
    alternates: { canonical: `/destinations/${slug}` },
    openGraph: {
      ...ogBase,
      url: `/destinations/${slug}`,
      title,
      description,
      images: d.heroImageUrl ? [{ url: d.heroImageUrl, alt: d.name }] : ogBase.images,
    },
  };
}

export default async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getDestination(slug);
  if (!data) notFound();
  const { destination: d, all } = data;

  const isCountry = d.destinationType === "COUNTRY";
  const highlights = normalizeHighlights(d.highlights);
  const paragraphs = (d.description ?? "").split(/\n{2,}/).filter(Boolean);

  // Countries list their towns and trail stops; places list neighbours in the same country.
  const children = isCountry ? all.filter((x) => x.parentCountry === d.name && x.slug !== d.slug) : [];
  const nearby = isCountry ? [] : all.filter((x) => x.country === d.country && x.slug !== d.slug && x.destinationType !== "COUNTRY");
  const countryPage = isCountry ? null : all.find((x) => x.destinationType === "COUNTRY" && x.name === d.country);

  // Real stage data: which days of which tours start or finish here.
  const stages = isCountry ? [] : await getStagesAtPlace(d.name);
  const tourCards = await getPublishedTourCards();
  const tourSlugsHere = new Set(stages.map((s) => s.tourSlug));
  // Every published tour is a Peaks of the Balkans variant crossing all three countries.
  const toursHere = isCountry ? tourCards : tourCards.filter((t) => tourSlugsHere.has(t.slug));
  // One row per distinct leg (guided and self-guided variants share stages).
  const legs = Array.from(
    new Map(stages.map((s) => [`${s.fromLocation}→${s.toLocation}`, s])).values(),
  );

  const url = `${SITE_URL}/destinations/${d.slug}`;
  // Some stored values end in a stray separator ("Albanian Lek (ALL) /").
  const clean = (v: string) => v.replace(/[\s/—–-]+$/, "");
  const facts = [
    { label: "Country", value: d.country },
    d.bestSeason && { label: "Best season", value: clean(d.bestSeason) },
    d.language && { label: "Language", value: clean(d.language) },
    d.currency && { label: "Currency", value: clean(d.currency) },
  ].filter(Boolean) as { label: string; value: string }[];

  const infoSections = [
    { title: "Geography", body: d.geography },
    { title: "Weather", body: d.weatherInfo },
    { title: "Safety", body: d.safetyInfo },
    { title: "Visas & entry", body: d.visaRequirements },
  ].filter((s) => s.body?.trim());

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": isCountry ? "Country" : "TouristDestination",
          name: d.name,
          description: d.description ?? undefined,
          url,
          image: d.heroImageUrl ?? undefined,
          ...(d.coordinates && { geo: { "@type": "GeoCoordinates", latitude: d.coordinates.lat, longitude: d.coordinates.lng } }),
          ...(!isCountry && { containedInPlace: { "@type": "Country", name: d.country } }),
          ...(highlights.length > 0 && {
            includesAttraction: highlights.map((h) => ({ "@type": "TouristAttraction", name: h.name, description: h.description })),
          }),
        }}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Destinations", url: `${SITE_URL}/destinations` },
          ...(countryPage ? [{ name: countryPage.name, url: `${SITE_URL}/destinations/${countryPage.slug}` }] : []),
          { name: d.name, url },
        ])}
      />

      {/* Hero */}
      <section className="relative h-[50vh] min-h-[380px] bg-dark overflow-hidden pt-[72px]">
        <Image src={d.heroImageUrl || FALLBACK_IMAGE} alt={d.name} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/30 to-dark/10" />
        <div className="absolute bottom-0 left-0 right-0 max-w-content mx-auto px-6 md:px-10 pb-10">
          <nav aria-label="Breadcrumb" className="text-[13px] text-white/60 mb-3 flex flex-wrap gap-1.5">
            <Link href="/destinations" className="text-white/60 no-underline hover:text-white">Destinations</Link>
            {countryPage && (
              <>
                <span aria-hidden="true">/</span>
                <Link href={`/destinations/${countryPage.slug}`} className="text-white/60 no-underline hover:text-white">{countryPage.name}</Link>
              </>
            )}
          </nav>
          <span className="inline-block text-[11px] font-semibold px-2 py-1 rounded tracking-[0.06em] uppercase bg-brand text-white mb-3">
            {TYPE_LABEL[d.destinationType ?? "TRAIL_STOP"]}
          </span>
          <h1 className="font-fraunces text-4xl md:text-6xl font-bold text-white tracking-tight max-w-[760px]">
            {isCountry ? `Hiking in ${d.name}` : d.name}
          </h1>
        </div>
      </section>

      {/* Quick facts */}
      <div className="bg-ink text-white py-4 border-b border-white/10">
        <div className="max-w-content mx-auto px-6 md:px-10 flex flex-wrap gap-6 md:gap-10 text-sm">
          {facts.map((f) => (
            <div key={f.label}>
              <div className="text-[11px] uppercase tracking-[0.1em] text-white/40">{f.label}</div>
              <div className="font-medium">{f.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-content mx-auto px-6 md:px-10 py-12 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
        <div className="space-y-14 min-w-0">
          {paragraphs.length > 0 && (
            <section>
              <SectionLabel>Overview</SectionLabel>
              <div className="space-y-4 text-[17px] leading-[1.75] text-ink/80">
                {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </section>
          )}

          {highlights.length > 0 && (
            <section>
              <SectionLabel>Highlights</SectionLabel>
              <h2 className="font-fraunces text-3xl font-bold tracking-tight mb-6">
                What to see {isCountry ? `in ${d.name}` : `around ${d.name}`}
              </h2>
              <ul className="grid sm:grid-cols-2 gap-4">
                {highlights.map((h) => (
                  <li key={h.name} className="border-2 border-divider rounded-card bg-white p-5">
                    <div className="font-semibold mb-1">{h.name}</div>
                    {h.description && <p className="text-sm text-ink/60">{h.description}</p>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {legs.length > 0 && (
            <section>
              <SectionLabel>On the Peaks of the Balkans</SectionLabel>
              <h2 className="font-fraunces text-3xl font-bold tracking-tight mb-6">Trail stages via {d.name}</h2>
              <ul className="divide-y-2 divide-divider border-2 border-divider rounded-card bg-white">
                {legs.map((s) => (
                  <li key={`${s.fromLocation}-${s.toLocation}`} className="p-5 flex flex-wrap items-center gap-x-6 gap-y-2">
                    <div className="font-semibold flex items-center gap-2 min-w-[220px]">
                      <MapPin className="w-4 h-4 text-terra" strokeWidth={1.5} />
                      {s.fromLocation} → {s.toLocation}
                    </div>
                    <div className="flex gap-5 text-sm text-ink/60">
                      {Number(s.distanceKm) > 0 && <span>{Number(s.distanceKm)} km</span>}
                      {s.elevationGainM ? <span>+{s.elevationGainM.toLocaleString()} m</span> : null}
                      {s.highestPointM ? <span className="flex items-center gap-1"><Mountain className="w-3.5 h-3.5" strokeWidth={1.5} />{s.highestPointM.toLocaleString()} m</span> : null}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {infoSections.map((s) => (
            <section key={s.title}>
              <SectionLabel>{s.title}</SectionLabel>
              <p className="text-[17px] leading-[1.75] text-ink/80 whitespace-pre-line">{s.body}</p>
            </section>
          ))}

          {children.length > 0 && (
            <section>
              <SectionLabel>Where to go</SectionLabel>
              <h2 className="font-fraunces text-3xl font-bold tracking-tight mb-6">Towns & trail stops in {d.name}</h2>
              <PlaceGrid places={children} />
            </section>
          )}

          {nearby.length > 0 && (
            <section>
              <SectionLabel>Nearby</SectionLabel>
              <h2 className="font-fraunces text-3xl font-bold tracking-tight mb-6">More places in {d.country}</h2>
              <PlaceGrid places={nearby} />
            </section>
          )}
        </div>

        {/* Sidebar: tours through this place */}
        <aside className="space-y-4 lg:sticky lg:top-24 self-start">
          {toursHere.length > 0 ? (
            <>
              <h2 className="font-fraunces text-xl font-bold tracking-tight">
                {isCountry ? `Treks through ${d.name}` : `Tours via ${d.name}`}
              </h2>
              {toursHere.map((t) => (
                <Link
                  key={t.slug}
                  href={`/tours/${t.slug}`}
                  className="group block border-2 border-divider rounded-card bg-white p-4 no-underline hover:border-brand transition-colors"
                >
                  <div className="font-semibold text-ink group-hover:text-brand transition-colors leading-snug">{t.title}</div>
                  <div className="mt-1 flex items-center justify-between text-sm text-ink/60">
                    <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" strokeWidth={1.5} />{t.durationDays} days</span>
                    <span className="font-mono text-ink">From {formatPrice(Number(t.pricePerPersonEur))}</span>
                  </div>
                </Link>
              ))}
            </>
          ) : (
            <div className="border-2 border-divider rounded-card bg-bone p-5">
              <h2 className="font-fraunces text-xl font-bold tracking-tight mb-2">Hike here with a local guide</h2>
              <p className="text-sm text-ink/60 mb-4">We design private trips around {d.name} for groups of 2–20.</p>
              <Link href="/private-trips" className="inline-flex items-center gap-2 text-sm font-semibold text-brand no-underline">
                Plan a private trip <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </Link>
            </div>
          )}
          <Link
            href="/peaks-of-the-balkans"
            className="flex items-center justify-between border-2 border-divider rounded-card bg-bone p-4 no-underline text-sm font-semibold text-ink hover:border-brand transition-colors"
          >
            About the Peaks of the Balkans trail <ArrowRight className="w-4 h-4 text-brand" strokeWidth={1.5} />
          </Link>
        </aside>
      </div>
    </>
  );
}

function PlaceGrid({ places }: { places: { slug: string; name: string; heroImageUrl: string | null; destinationType: string | null }[] }) {
  return (
    <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {places.map((p) => (
        <li key={p.slug}>
          <Link href={`/destinations/${p.slug}`} className="group block rounded-card overflow-hidden border-2 border-divider bg-white no-underline hover:border-brand transition-colors">
            <div className="relative h-28 md:h-36">
              <Image src={p.heroImageUrl || FALLBACK_IMAGE} alt={p.name} fill sizes="(min-width: 768px) 240px, 50vw" className="object-cover" />
            </div>
            <div className="p-3">
              <div className="font-semibold text-ink text-sm group-hover:text-brand transition-colors">{p.name}</div>
              <div className="text-[11px] uppercase tracking-[0.08em] text-ink/45">{TYPE_LABEL[(p.destinationType ?? "TRAIL_STOP") as keyof typeof TYPE_LABEL]}</div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
