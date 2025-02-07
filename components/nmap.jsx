"use client";
import dynamic from "next/dynamic";
import React, { useMemo } from "react";

export default function MyPage({ lat, lng }) {
  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/map"), {
        loading: () => <p>A map is loading...</p>,
        ssr: false,
      }),
    []
  );

  return (
    <div className="w-full">
      <Map position={[lat, lng]} classN="h-48 w-full mt-12" />
    </div>
  );
}
