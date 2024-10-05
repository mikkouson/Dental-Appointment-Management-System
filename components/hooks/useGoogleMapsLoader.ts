// useGoogleMapsLoader.ts
"use client";
import { useJsApiLoader } from "@react-google-maps/api";
import { useState } from "react";

const useGoogleMapsLoader = () => {
  const [libraries] = useState(["places", "maps"]);
  return useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API as string,
    libraries: libraries as any,
  });
};

export default useGoogleMapsLoader;
