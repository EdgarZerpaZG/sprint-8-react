import { useEffect, useRef, useState } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { useWeatherAndLocation } from "../../hooks/useWeatherAndLocation";

const GOOGLE_MAP_LIBRARIES = ["marker"];

export default function GoogleMapComponent() {
  const { coords, temperature, timezone } = useWeatherAndLocation();

  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
    libraries: GOOGLE_MAP_LIBRARIES as any,
  });

  const [showMalls, setShowMalls] = useState(false);
  const [showRestaurant, setShowRestaurant] = useState(false);

  const mallMarkersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const restaurantMarkersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

  const generateMallPoints = () => {
    if (!coords) return [];
    const km = 1 / 111; // 1 km en grados

    return [
      {
        name: "Mall Norte",
        position: { lat: coords.lat + km, lng: coords.lng },
      },
      {
        name: "Mall Sur",
        position: { lat: coords.lat - km, lng: coords.lng },
      },
      {
        name: "Mall Este",
        position: { lat: coords.lat, lng: coords.lng + km },
      },
    ];
  };

  const generateRestaurantPoints = () => {
    if (!coords) return [];
    const kmTwo = 2 / 111; // 2 km en grados

    return [
      {
        name: "Restaurant Norte",
        position: { lat: coords.lat - kmTwo, lng: coords.lng },
      },
      {
        name: "Restaurant Sur",
        position: { lat: coords.lat + kmTwo, lng: coords.lng },
      },
      {
        name: "Restaurant Este",
        position: { lat: coords.lat, lng: coords.lng - kmTwo },
      },
    ];
  };

  // Inicializar mapa y marcador principal
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
      title: `Temp actual: ${temperature?.toFixed()}°C`,
    });
  }, [isLoaded, coords, temperature]);

  useEffect(() => {
    if (!mapInstance.current) return;

    mallMarkersRef.current.forEach(m => m.map = null);
    mallMarkersRef.current = [];

    restaurantMarkersRef.current.forEach(m => m.map = null);
    restaurantMarkersRef.current = [];

    if (showMalls){
      const malls = generateMallPoints();
      malls.forEach(mall => {
        const marker = new google.maps.marker.AdvancedMarkerElement({
          map: mapInstance.current!,
          position: mall.position,
          title: mall.name,
          content: createBalloonMarker(mall.name),
        });
      mallMarkersRef.current.push(marker);
    });
    }
    if (showRestaurant){
      const restaurant = generateRestaurantPoints();
      restaurant.forEach(restaurant => {
        const marker = new google.maps.marker.AdvancedMarkerElement({
          map: mapInstance.current!,
          position: restaurant.position,
          title: restaurant.name,
          content: createBalloonMarker(restaurant.name),
        });
      restaurantMarkersRef.current.push(marker);
      });
    }

  }, [showMalls, showRestaurant, coords]);

  // Marker
  const createBalloonMarker = (title: string) => {
    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.alignItems = "center";
    wrapper.style.transform = "translate(-50%, -100%)";
    wrapper.title = title;

    // Globe
    const circle = document.createElement("div");
    circle.style.width = "22px";
    circle.style.height = "22px";
    circle.style.borderRadius = "50%";
    circle.style.backgroundColor = "#1E90FF";
    circle.style.boxShadow = "0 0 6px rgba(0, 0, 0, 0.3)";

    // Bottom tip
    const pointer = document.createElement("div");
    pointer.style.width = "0";
    pointer.style.height = "0";
    pointer.style.borderLeft = "6px solid transparent";
    pointer.style.borderRight = "6px solid transparent";
    pointer.style.borderTop = "10px solid #1E90FF";

    wrapper.appendChild(circle);
    wrapper.appendChild(pointer);

    return wrapper;
  };

  if (!isLoaded) return <p>Loading map...</p>;
  if (!coords) return <p>Getting location...</p>;

  return (
    <>
      <div className="text-white mt-3 mb-3">
        <label style={{ cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={showMalls}
            onChange={() => setShowMalls(prev => !prev)}
            style={{ marginRight: "8px" }}
          />
          Show Malls (1 km)
        </label>
      </div>

      <div className="text-white mt-3 mb-3">
        <label style={{ cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={showRestaurant}
            onChange={() => setShowRestaurant(prev => !prev)}
            style={{ marginRight: "8px" }}
          />
          Show Restaurants (2 km)
        </label>
      </div>

      <div ref={mapRef} style={{ width: "100%", height: "600px" }} />

      <div className="text-white mt-3">
        <p>Latitude: {coords.lat.toFixed(4)}</p>
        <p>Longitude: {coords.lng.toFixed(4)}</p>
        <p>Timezone: {timezone}</p>
        <p>Current Temp: {temperature?.toFixed()}°C</p>
      </div>
    </>
  );
}