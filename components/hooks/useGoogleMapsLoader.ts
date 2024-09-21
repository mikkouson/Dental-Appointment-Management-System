// useGoogleMapsLoader.ts
import { useJsApiLoader } from "@react-google-maps/api";

const useGoogleMapsLoader = () => {
  return useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API as string,
    libraries: ["places", "maps"], // Include both libraries if needed
  });
};

export default useGoogleMapsLoader;
