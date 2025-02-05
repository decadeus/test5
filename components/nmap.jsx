"use client";
import dynamic from "next/dynamic";
import React, { useMemo } from "react";

export default function MyPage() {
  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/map"), {
        loading: () => <p>A map is loading...</p>,
        ssr: false,
      }),
    []
  );

  return (
    <div className="">
      <Map position={[55.50554, 10.0925]} classN="h-48 w-full mt-12" />
    </div>
  );
}
