import { useEffect, useState } from "react";
import { fetchWeatherApi } from "openmeteo";

export function useWeatherAndLocation() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [timezone, setTimezone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 8000,
            maximumAge: 0,
          });
        });

        if (cancelled) return;

        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setCoords({ lat, lng });

        const params = {
          latitude: lat,
          longitude: lng,
          hourly: "temperature_2m",
          current: "temperature_2m",
          timezone: "auto",
        };

        const url = import.meta.env.VITE_OPEN_METEO_URL;

        const responses = await fetchWeatherApi(url, params);
        if (!responses || responses.length === 0) {
          throw new Error("No weather data received");
        }

        const response = responses[0];

        setTimezone(response.timezone());

        const current = response.current();
        if (!current) {
          throw new Error("No current weather data available");
        }

        const temp = current.variables(0)?.value();
        setTemperature(temp ?? null);
      } catch (err: any) {
        console.error(err);
        setError("Failed to get location or weather.");
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { coords, temperature, timezone, error };
}