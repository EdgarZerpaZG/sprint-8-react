import { useEffect, useRef } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { useWeatherAndLocation } from "../../hooks/useWeatherAndLocation";

const GOOGLE_MAP_LIBRARIES: ("marker")[] = ["marker"];

export default function GoogleMapComponent() {
  const { coords, temperature, timezone } = useWeatherAndLocation();

  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
    libraries: GOOGLE_MAP_LIBRARIES,
  });

  useEffect(() => {
    if (!isLoaded || !coords || !mapRef.current) return;

    const position = { lat: coords.lat, lng: coords.lng };

    mapInstance.current = new google.maps.Map(mapRef.current, {
      center: position,
      zoom: 13,
      mapId: import.meta.env.VITE_GOOGLE_MAP_ID, 
    });

    new google.maps.marker.AdvancedMarkerElement({
      map: mapInstance.current,
      position,
      title: `Temperatura actual: ${temperature?.toFixed()}°C`,
    });
  }, [isLoaded, coords, temperature]);

  if (!isLoaded) return <p>Loading map...</p>;
  if (!coords) return <p>Getting location...</p>;

  return (
    <>
      <div ref={mapRef} style={{ width: "100%", height: "400px" }} />
      <div className="text-white mt-3">
        <p>Lat: {coords.lat.toFixed(4)}</p>
        <p>Lng: {coords.lng.toFixed(4)}</p>
        <p>Timezone: {timezone}</p>
        <p>Temp actual: {temperature?.toFixed()}°C</p>
      </div>
    </>
  );
}