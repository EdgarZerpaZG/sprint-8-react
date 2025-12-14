import { useEffect, useRef, useState } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { useWeatherAndLocation } from "../../hooks/useWeatherAndLocation";
import { useUserProfileMarkersForMap } from "../../hooks/useUserProfileMarkersForMap";
import { useAuth } from "../../hooks/useAuth";

const GOOGLE_MAP_LIBRARIES = ["marker", "places"];

export default function GoogleMapComponent() {
  const { coords, temperature } = useWeatherAndLocation();
  const { user } = useAuth();

  const {
    markers: userMarkersData,
    loading: loadingUserMarkers,
    error: markersError,
    isAdmin,
  } = useUserProfileMarkersForMap();

  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);

  const userMarkersRef = useRef<google.maps.Marker[]>([]);
  const sushiMarkersRef = useRef<google.maps.Marker[]>([]);
  const bbqMarkersRef = useRef<google.maps.Marker[]>([]);
  const cafeMarkersRef = useRef<google.maps.Marker[]>([]);
  const mallMarkersRef = useRef<google.maps.Marker[]>([]);
  const parkMarkersRef = useRef<google.maps.Marker[]>([]);
  const hobbyMarkersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
    libraries: GOOGLE_MAP_LIBRARIES as any,
  });

  const [showUsers, setShowUsers] = useState(true);
  const [showSushi, setShowSushi] = useState(false);
  const [showBBQ, setShowBBQ] = useState(false);
  const [showCafes, setShowCafes] = useState(false);
  const [showMalls, setShowMalls] = useState(false);
  const [showParks, setShowParks] = useState(false);
  const [showHobbyPlaces, setShowHobbyPlaces] = useState(true); // default ON

  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [placesError, setPlacesError] = useState<string | null>(null);

  // Initialize map using device coords as a fallback
  useEffect(() => {
    if (!isLoaded || !coords || !mapRef.current) return;

    const position = { lat: coords.lat, lng: coords.lng };

    mapInstance.current = new google.maps.Map(mapRef.current, {
      center: position,
      zoom: 10,
      mapId: import.meta.env.VITE_GOOGLE_MAP_ID,
    });

    new google.maps.Marker({
      map: mapInstance.current,
      position,
      title: `Current location - Temp: ${temperature?.toFixed()}°C`,
    });
  }, [isLoaded, coords, temperature]);

  // Draw / clear user markers (from user_profiles)
  useEffect(() => {
    if (!mapInstance.current) return;

    // Clear previous user markers
    userMarkersRef.current.forEach((m) => m.setMap(null));
    userMarkersRef.current = [];

    if (!showUsers) return;
    if (!userMarkersData.length) return;

    userMarkersData.forEach((u) => {
      const marker = new google.maps.Marker({
        map: mapInstance.current!,
        position: { lat: u.lat, lng: u.lng },
        title: `${u.username} - ${u.location} (${u.hobby})`,
        icon: {
          url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
        },
      });
      userMarkersRef.current.push(marker);
    });

    if (!isAdmin && userMarkersData.length === 1) {
      const { lat, lng } = userMarkersData[0];
      mapInstance.current!.setCenter({ lat, lng });
      mapInstance.current!.setZoom(12);
    }
  }, [showUsers, userMarkersData, isAdmin]);

  useEffect(() => {
    if (!mapInstance.current) return;
    if (!coords) return;

    const clearMarkerList = (list: google.maps.Marker[]) => {
      list.forEach((m) => m.setMap(null));
    };

    // Clear all place markers first
    clearMarkerList(sushiMarkersRef.current);
    clearMarkerList(bbqMarkersRef.current);
    clearMarkerList(cafeMarkersRef.current);
    clearMarkerList(mallMarkersRef.current);
    clearMarkerList(parkMarkersRef.current);
    clearMarkerList(hobbyMarkersRef.current);

    sushiMarkersRef.current = [];
    bbqMarkersRef.current = [];
    cafeMarkersRef.current = [];
    mallMarkersRef.current = [];
    parkMarkersRef.current = [];
    hobbyMarkersRef.current = [];

    const anyCategoryOn =
      showSushi ||
      showBBQ ||
      showCafes ||
      showMalls ||
      showParks ||
      showHobbyPlaces;

    if (!anyCategoryOn) {
      setLoadingPlaces(false);
      setPlacesError(null);
      return;
    }

    const currentUserLocation =
      !isAdmin && userMarkersData.length === 1
        ? {
            lat: userMarkersData[0].lat,
            lng: userMarkersData[0].lng,
          }
        : null;

    const baseLocation = currentUserLocation ?? {
      lat: coords.lat,
      lng: coords.lng,
    };

    const service = new google.maps.places.PlacesService(mapInstance.current!);

    setLoadingPlaces(true);
    setPlacesError(null);

    const ensureInfoWindow = () => {
      if (!infoWindowRef.current) {
        infoWindowRef.current = new google.maps.InfoWindow();
      }
      return infoWindowRef.current!;
    };

    const searchCategory = (
      enabled: boolean,
      request: google.maps.places.PlaceSearchRequest,
      markersRef: { current: google.maps.Marker[] },
      iconUrl: string,
      label: string
    ) => {
      if (!enabled) return;

      service.nearbySearch(request, (results, status) => {
        console.log("Places search:", label, "status:", status, "results:", results);

        if (
          status !== google.maps.places.PlacesServiceStatus.OK ||
          !results ||
          results.length === 0
        ) {
          setPlacesError((prev) =>
            prev ?? `Places search failed for ${label}: status=${status}`
          );
          return;
        }

        results.forEach((place) => {
          if (!place.geometry || !place.geometry.location) return;

          const marker = new google.maps.Marker({
            map: mapInstance.current!,
            position: place.geometry.location,
            title: place.name ?? "Recommended place",
            icon: { url: iconUrl },
          });

          const infoWindow = ensureInfoWindow();
          const name = place.name ?? "Place";
          const vicinity = place.vicinity ?? "";
          const rating = place.rating ? `Rating: ${place.rating}` : "";

          marker.addListener("click", () => {
            infoWindow.setContent(
              `<div>
                <strong>${name}</strong><br/>
                ${vicinity}<br/>
                ${rating}
              </div>`
            );
            infoWindow.open({
              map: mapInstance.current!,
              anchor: marker,
            });
          });

          markersRef.current.push(marker);
        });
      });
    };

    const baseRequestLocation = {
      location: baseLocation,
      radius: 1000,
    };

    // Sushi restaurants
    searchCategory(
      showSushi,
      {
        ...baseRequestLocation,
        keyword: "sushi",
        type: "restaurant",
      },
      sushiMarkersRef,
      "http://maps.google.com/mapfiles/ms/icons/pink-dot.png",
      "sushi"
    );

    // BBQ / grill restaurants
    searchCategory(
      showBBQ,
      {
        ...baseRequestLocation,
        keyword: "bbq",
        type: "restaurant",
      },
      bbqMarkersRef,
      "http://maps.google.com/mapfiles/ms/icons/orange-dot.png",
      "bbq"
    );

    // Coffeeshops
    searchCategory(
      showCafes,
      {
        ...baseRequestLocation,
        type: "cafe",
      },
      cafeMarkersRef,
      "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
      "cafe"
    );

    // Shopping malls
    searchCategory(
      showMalls,
      {
        ...baseRequestLocation,
        type: "shopping_mall",
      },
      mallMarkersRef,
      "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
      "shopping_mall"
    );

    // Parks
    searchCategory(
      showParks,
      {
        ...baseRequestLocation,
        type: "park",
      },
      parkMarkersRef,
      "http://maps.google.com/mapfiles/ms/icons/purple-dot.png",
      "park"
    );

    const hobbyText =
      user?.hobby?.trim() ||
      (!isAdmin && userMarkersData.length === 1
        ? userMarkersData[0].hobby?.trim()
        : "");

    if (showHobbyPlaces) {
      if (!hobbyText) {
        setPlacesError(
          (prev) => prev ?? "No hobby set for current user to search related places."
        );
      } else {
        searchCategory(
          true,
          {
            ...baseRequestLocation,
            keyword: hobbyText,
          },
          hobbyMarkersRef,
          "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
          `hobby:${hobbyText}`
        );
      }
    }

    const timeout = setTimeout(() => {
      setLoadingPlaces(false);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [
    coords,
    showSushi,
    showBBQ,
    showCafes,
    showMalls,
    showParks,
    showHobbyPlaces,
    isAdmin,
    user?.hobby,
    userMarkersData,
  ]);

  if (!isLoaded) return <p>Loading map...</p>;
  if (!coords) return <p>Getting location...</p>;

  return (
    <>
      <div className="text-white mt-3 mb-3 space-y-2">
        <div className="space-y-1">
          <label style={{ cursor: "pointer", display: "block" }}>
            <input
              type="checkbox"
              checked={showUsers}
              onChange={() => setShowUsers((prev) => !prev)}
              style={{ marginRight: "8px" }}
            />
            Show user locations
          </label>

          <label style={{ cursor: "pointer", display: "block" }}>
            <input
              type="checkbox"
              checked={showHobbyPlaces}
              onChange={() => setShowHobbyPlaces((prev) => !prev)}
              style={{ marginRight: "8px" }}
            />
            Places related to your hobby (1 km)
          </label>

          <label style={{ cursor: "pointer", display: "block" }}>
            <input
              type="checkbox"
              checked={showSushi}
              onChange={() => setShowSushi((prev) => !prev)}
              style={{ marginRight: "8px" }}
            />
            Sushi restaurants (1 km)
          </label>

          <label style={{ cursor: "pointer", display: "block" }}>
            <input
              type="checkbox"
              checked={showBBQ}
              onChange={() => setShowBBQ((prev) => !prev)}
              style={{ marginRight: "8px" }}
            />
            BBQ / grill restaurants (1 km)
          </label>

          <label style={{ cursor: "pointer", display: "block" }}>
            <input
              type="checkbox"
              checked={showCafes}
              onChange={() => setShowCafes((prev) => !prev)}
              style={{ marginRight: "8px" }}
            />
            Cafés (1 km)
          </label>

          <label style={{ cursor: "pointer", display: "block" }}>
            <input
              type="checkbox"
              checked={showMalls}
              onChange={() => setShowMalls((prev) => !prev)}
              style={{ marginRight: "8px" }}
            />
            Shopping malls (1 km)
          </label>

          <label style={{ cursor: "pointer", display: "block" }}>
            <input
              type="checkbox"
              checked={showParks}
              onChange={() => setShowParks((prev) => !prev)}
              style={{ marginRight: "8px" }}
            />
            Parks (1 km)
          </label>
        </div>

        {loadingUserMarkers && (
          <p className="text-xs text-gray-400">Loading user locations…</p>
        )}

        {markersError && (
          <p className="text-xs text-red-300">
            Error loading user profiles: {markersError}
          </p>
        )}

        {loadingPlaces && (
          <p className="text-xs text-gray-400">Searching nearby places…</p>
        )}

        {placesError && (
          <p className="text-xs text-red-300">{placesError}</p>
        )}

        <p className="text-xs text-gray-300">
          {isAdmin
            ? "Admin view: you see all user locations (green) and the selected nearby places (red for hobby, other colors by category)."
            : "User view: you see your stored location (green) and the selected nearby places around it (red for hobby, other colors by category)."}
        </p>
      </div>

      <div ref={mapRef} style={{ width: "100%", height: "600px" }} />
    </>
  );
}