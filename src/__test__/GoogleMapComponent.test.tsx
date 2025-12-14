import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import GoogleMapComponent from "../components/map/map";

vi.mock("../hooks/useWeatherAndLocation", () => ({
  useWeatherAndLocation: () => ({
    coords: { lat: 41.3874, lng: 2.1686 },
    temperature: 20,
    timezone: "Europe/Madrid",
    error: null,
  }),
}));

vi.mock("../hooks/useUserProfileMarkersForMap", () => ({
  useUserProfileMarkersForMap: () => ({
    markers: [
      {
        id: "profile-1",
        username: "user1",
        email: "u1@test.com",
        hobby: "padel",
        location: "Somewhere",
        lat: 41.3874,
        lng: 2.1686,
      },
    ],
    loading: false,
    error: null,
    isAdmin: false,
  }),
}));

vi.mock("../hooks/useAuth", () => ({
  useAuth: () => ({
    user: {
      id: "auth-1",
      username: "user1",
      email: "u1@test.com",
      hobby: "padel",
    },
  }),
}));

vi.mock("@react-google-maps/api", () => ({
  useLoadScript: () => ({ isLoaded: true }),
}));

describe("GoogleMapComponent - hobby places", () => {
  let nearbySearchMock: any;

  beforeEach(() => {
    nearbySearchMock = vi.fn((_req, cb) => {
      cb([], "OK");
    });

    const MapMock = vi.fn(function (this: any) {
      this.setCenter = vi.fn();
      this.setZoom = vi.fn();
    });

    const MarkerMock = vi.fn(function (this: any, _opts: any) {
      this.setMap = vi.fn();
    });

    const InfoWindowMock = vi.fn(function (this: any) {
      this.setContent = vi.fn();
      this.open = vi.fn();
    });

    const PlacesServiceMock = vi.fn(function (this: any, _map: any) {
      this.nearbySearch = nearbySearchMock;
    });

    (globalThis as any).google = {
      maps: {
        Map: MapMock,
        Marker: MarkerMock,
        InfoWindow: InfoWindowMock,
        places: {
          PlacesService: PlacesServiceMock,
          PlacesServiceStatus: {
            OK: "OK",
          },
        },
      },
    };
  });

  it("calls PlacesService.nearbySearch with hobby as keyword", async () => {
    render(<GoogleMapComponent />);

    await waitFor(() => {
      expect(nearbySearchMock).toHaveBeenCalled();
    });

    const callArgs = nearbySearchMock.mock.calls[0][0];
    expect(callArgs.keyword).toBe("padel");
    expect(callArgs.radius).toBe(1000);
    expect(callArgs.location).toEqual({
      lat: 41.3874,
      lng: 2.1686,
    });
  });
});