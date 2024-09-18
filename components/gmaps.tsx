import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Autocomplete,
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";

type MapsProps = {
  field: {
    name: string;
    onChange: (value: any) => void;
    onBlur: () => void;
    value: any;
  };
};

const Maps = ({ field }: MapsProps) => {
  const [formattedAddress, setFormattedAddress] = useState("");
  const [center, setCenter] = useState<google.maps.LatLngLiteral | undefined>(
    undefined
  );
  const [markerPosition, setMarkerPosition] = useState<
    google.maps.LatLngLiteral | undefined
  >(undefined);
  const [initialCountry, setInitialCountry] = useState<string>("PH"); // Default to 'PH'

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API as string,
    libraries: ["places"],
  });

  const updateAddress = (latLng: google.maps.LatLngLiteral) => {
    const geocoder = new google.maps.Geocoder();
    const latLngObj = new google.maps.LatLng(latLng.lat, latLng.lng);

    geocoder.geocode({ location: latLngObj }, (results, status) => {
      if (status === "OK" && results && results.length > 0) {
        const address = results[0].formatted_address || "";
        setFormattedAddress(address);
        const country =
          results[0].address_components.find((component) =>
            component.types.includes("country")
          )?.short_name || "";

        if (country !== initialCountry) {
          // Clear the input and coordinates if the country has changed
          setFormattedAddress("");
          setMarkerPosition(undefined);
          setCenter(undefined);
          field.onChange({
            address: "",
            latitude: undefined,
            longitude: undefined,
          });
        } else {
          setMarkerPosition(latLng);
          setCenter(latLng);
          field.onChange({
            address: formattedAddress,
            latitude: latLng.lat,
            longitude: latLng.lng,
          });
        }
      }
    });
  };

  const handlePlacesChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place) {
        if (place.formatted_address) {
          setFormattedAddress(place.formatted_address);
        }
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

  return (
    <div className="mb-4">
      <Autocomplete
        options={{ componentRestrictions: { country: "PH" } }}
        onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
        onPlaceChanged={handlePlacesChanged}
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
            options={{ streetViewControl: false, fullscreenControl: false }}
          >
            {markerPosition && (
              <Marker
                position={markerPosition}
                draggable
                onDragEnd={handleMarkerDragEnd}
                title="Your address is here"
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
