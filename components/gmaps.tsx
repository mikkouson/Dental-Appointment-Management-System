"use client";

import React, { useRef } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import { Input } from "@/components/ui/input";

interface MapsProps {
  field: any; // Adjust as needed based on your form library
}

const Maps = ({ field }: MapsProps) => {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API as string,
    libraries: ["places"],
  });

  const handlePlaceChanged = () => {
    if (autocompleteRef.current && isLoaded) {
      const place = autocompleteRef.current.getPlace();
      if (
        place.formatted_address &&
        place.address_components &&
        place.geometry?.location
      ) {
        // Check if the place is in the Philippines
        const isInPhilippines = place.address_components.some(
          (component) =>
            component.short_name === "PH" && component.types.includes("country")
        );

        const addressWithoutPlusCode = place.formatted_address.replace(
          /^[A-Z0-9]+[+\-][A-Z0-9]+\s*/,
          ""
        );

        if (isInPhilippines) {
          field.onChange({
            address: addressWithoutPlusCode,
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
          });
        } else {
          field.onChange({
            address: "",
            latitude: "",
            longitude: "",
          });
        }
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

      const newAddress = await reverseGeocode(snappedPosition);
      const isInPhilippines = newAddress !== "Address not available";

      field.onChange({
        address: isInPhilippines ? newAddress : "",
        latitude: snappedPosition.lat,
        longitude: snappedPosition.lng,
      });
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
    const data: {
      results?: {
        formatted_address?: string;
        address_components?: google.maps.GeocoderAddressComponent[];
      }[];
    } = await response.json();

    if (data.results && data.results.length > 0) {
      let formattedAddress = data.results[0].formatted_address || "";

      // Remove Plus Codes from the address
      formattedAddress = formattedAddress
        .replace(/^[A-Z0-9]+[+\-][A-Z0-9]+\s*/, "")
        .trim();

      // Remove leading apostrophe if it exists
      if (formattedAddress.startsWith(",")) {
        formattedAddress = formattedAddress.replace(/^\s*,\s*/, "").trim();
      }

      // Check if the address is in the Philippines
      const isInPhilippines = data.results[0].address_components?.some(
        (component) =>
          component.short_name === "PH" && component.types.includes("country")
      );

      return isInPhilippines ? formattedAddress : "Address not available";
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
          value={field.value?.address || ""}
          onChange={(e) => {
            const newAddress = e.target.value;
            field.onChange({
              address: newAddress,
              latitude: "", // Clear latitude when typing
              longitude: "", // Clear longitude when typing
            });
          }}
        />
      </Autocomplete>
      {field.value?.latitude && field.value?.longitude && (
        <div className="relative h-96">
          <GoogleMap
            mapContainerStyle={{ height: "100%", width: "100%" }}
            center={{
              lat: field.value.latitude,
              lng: field.value.longitude,
            }}
            zoom={17}
            options={{
              streetViewControl: false,
              fullscreenControl: false,
            }}
          >
            <Marker
              position={{
                lat: field.value.latitude,
                lng: field.value.longitude,
              }}
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
          </GoogleMap>
        </div>
      )}
    </div>
  );
};

export default Maps;
