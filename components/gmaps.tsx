import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Autocomplete, GoogleMap, Marker } from "@react-google-maps/api";
import useGoogleMapsLoader from "./hooks/useGoogleMapsLoader";

type MapsProps = {
  field: {
    name: string;
    onChange: (value: any) => void;
    onBlur: () => void;
    value: {
      address?: string;
      latitude?: number;
      longitude?: number;
      id?: number;
    };
  };
};

const Maps = ({ field }: MapsProps) => {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const { isLoaded } = useGoogleMapsLoader();

  const updateAddress = (latLng: google.maps.LatLngLiteral) => {
    const geocoder = new google.maps.Geocoder();
    const latLngObj = new google.maps.LatLng(latLng.lat, latLng.lng);

    geocoder.geocode({ location: latLngObj }, (results, status) => {
      if (status === "OK" && results && results.length > 0) {
        const address = results[0].formatted_address || "";

        field.onChange({
          address: address,
          latitude: latLng.lat,
          longitude: latLng.lng,
          id: field.value?.id,
        });
      }
    });
  };

  const handlePlacesChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place) {
        const address = place.formatted_address || "";
        field.onChange({
          ...field.value,
          address: address,
        });
        if (place.geometry?.location) {
          const latLng = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };
          updateAddress(latLng);
        }
      }
    } else {
      console.error("No places found");
    }
  };

  const handleMarkerDragEnd = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newPosition = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      updateAddress(newPosition);
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const { address = "", latitude, longitude } = field.value || {};

  return (
    <div className="mb-4">
      <Autocomplete
        options={{ componentRestrictions: { country: "PH" } }}
        onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
        onPlaceChanged={handlePlacesChanged}
      >
        <Input
          value={address}
          onChange={(e) =>
            field.onChange({ ...field.value, address: e.target.value })
          }
        />
      </Autocomplete>
      {latitude && longitude && (
        <div className="relative h-72">
          <GoogleMap
            mapContainerStyle={{ height: "100%", width: "100%" }}
            center={{ lat: latitude, lng: longitude }}
            zoom={17}
            options={{ streetViewControl: false, fullscreenControl: false }}
          >
            <Marker
              position={{ lat: latitude, lng: longitude }}
              draggable
              onDragEnd={handleMarkerDragEnd}
              options={{
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
