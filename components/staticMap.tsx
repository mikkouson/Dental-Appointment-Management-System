import React from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import useGoogleMapsLoader from "./hooks/useGoogleMapsLoader";

type MapsProps = {
  latitude?: number;
  longitude?: number;
};

const StaticMaps = ({ latitude, longitude }: MapsProps) => {
  const { isLoaded } = useGoogleMapsLoader();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {latitude && longitude && (
        <div className="relative h-40">
          <GoogleMap
            mapContainerStyle={{ height: "100%", width: "100%" }}
            center={{ lat: latitude, lng: longitude }}
            zoom={13}
            options={{ streetViewControl: false, fullscreenControl: false }}
          >
            <Marker
              position={{ lat: latitude, lng: longitude }}
              title="Patient's Address"
            />
          </GoogleMap>
        </div>
      )}
    </>
  );
};

export default StaticMaps;
