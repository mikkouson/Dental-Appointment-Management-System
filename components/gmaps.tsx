import { Input } from "@/components/ui/input";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
  useJsApiLoader,
} from "@react-google-maps/api";
import React, { useRef } from "react";

const Maps = () => {
  const [formattedAddress, setFormattedAddress] = React.useState("");
  const [center, setCenter] = React.useState<
    google.maps.LatLng | google.maps.LatLngLiteral | undefined
  >(undefined);
  const [markerPosition, setMarkerPosition] = React.useState<
    google.maps.LatLngLiteral | undefined
  >(undefined);

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API as string,
    libraries: ["places"],
  });

  const handlePlaceChanged = () => {
    if (autocompleteRef.current && isLoaded) {
      const place = autocompleteRef.current.getPlace();
      if (place.formatted_address) {
        setFormattedAddress(place.formatted_address);
      }
      if (place.geometry?.location) {
        const latLng = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setCenter(latLng);
        setMarkerPosition(latLng);
      }
    } else {
      console.error("No places found or API not loaded");
    }
  };

  const handleMarkerDragEnd = async (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newPosition = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };

      const snappedPosition = await snapToRoad(newPosition);

      setMarkerPosition(snappedPosition);
      setCenter(snappedPosition);

      // Update address based on new marker position
      const newAddress = await reverseGeocode(snappedPosition);
      setFormattedAddress(newAddress);
    }
  };

  const snapToRoad = async (position: google.maps.LatLngLiteral) => {
    if (!isLoaded) return position;

    const apiKey = process.env.NEXT_PUBLIC_MAPS_API;
    const response = await fetch(
      `https://roads.googleapis.com/v1/nearestRoads?points=${position.lat},${position.lng}&key=${apiKey}`
    );
    const data = await response.json();
    if (data && data.snappedPoints && data.snappedPoints.length > 0) {
      const snappedPoint = data.snappedPoints[0];
      return {
        lat: snappedPoint.location.latitude,
        lng: snappedPoint.location.longitude,
      };
    }
    return position; // Fallback to original position if no snapped point is found
  };

  const reverseGeocode = async (position: google.maps.LatLngLiteral) => {
    if (!isLoaded) return "Address not available";

    const apiKey = process.env.NEXT_PUBLIC_MAPS_API;
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.lat},${position.lng}&key=${apiKey}`
    );
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      let formattedAddress = data.results[0].formatted_address;

      // Remove Plus Codes from the address
      formattedAddress = formattedAddress
        .replace(/^[A-Z0-9]+[+\-][A-Z0-9]+\s*/, "")
        .trim();

      // Remove leading apostrophe if it exists
      if (formattedAddress.startsWith(",")) {
        formattedAddress = formattedAddress.replace(/^\s*,\s*/, "").trim();
      }

      return formattedAddress || "Address not available";
    }
    return "Address not available";
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="mb-4">
      <Autocomplete
        options={{
          componentRestrictions: { country: "PH" }, // Restrict to Philippines
        }}
        onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
        onPlaceChanged={handlePlaceChanged}
      >
        <Input
          placeholder="Enter your address"
          value={formattedAddress}
          onChange={(e) => setFormattedAddress(e.target.value)}
        />
      </Autocomplete>
      {center && (
        <div className="relative h-96">
          <GoogleMap
            mapContainerStyle={{ height: "100%", width: "100%" }}
            center={markerPosition || center}
            zoom={17}
            options={{
              streetViewControl: false,
              fullscreenControl: false,
            }}
          >
            {markerPosition && (
              <Marker
                position={markerPosition}
                draggable
                onDragEnd={handleMarkerDragEnd}
                options={{
                  label: {
                    text: "Your address is here",
                    fontWeight: "bold",
                    fontSize: "14px",
                  },
                  animation: google.maps.Animation.DROP,
                }}
              />
            )}
          </GoogleMap>
        </div>
      )}
      {markerPosition && (
        <div className="mt-4">
          <p>
            <strong>Latitude:</strong> {markerPosition.lat}
          </p>
          <p>
            <strong>Longitude:</strong> {markerPosition.lng}
          </p>
        </div>
      )}
    </div>
  );
};

export default Maps;
