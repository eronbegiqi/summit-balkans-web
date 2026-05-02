"use client";

import dynamic from "next/dynamic";

const RouteMap = dynamic(
  () => import("@/components/pob/RouteMap").then((m) => m.RouteMap),
  {
    ssr: false,
    loading: () => (
      <div className="py-20 md:py-28 bg-bone">
        <div className="max-w-content mx-auto px-5 md:px-10">
          <div className="h-[480px] md:h-[560px] rounded-card-hero bg-divider/40 animate-pulse" />
        </div>
      </div>
    ),
  }
);

export function RouteMapClient() {
  return <RouteMap />;
}
