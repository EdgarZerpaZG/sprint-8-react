import {useState} from "react";
import {APIProvider, Map, Marker, InfoWindow} from "@vis.gl/react-google-maps";

const puntos = [
  {id: 1, name: "Puerta del Sol", position: {lat: 40.4168, lng: -3.7038}},
  {id: 2, name: "Plaza Mayor", position: {lat: 40.4154, lng: -3.7074}},
];

type Punto = {
  id: number;
  name: string;
  position: { lat: number; lng: number };
};

export default function App() {
  const [activo, setActivo] = useState<Punto | null>(null);

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <Map
        style={{width: "100%", height: "100vh"}}
        defaultCenter={{lat: 40.4168, lng: -3.7038}}
        defaultZoom={14}
      >
        {puntos.map((p) => (
          <Marker
            key={p.id}
            position={p.position}
            onClick={() => setActivo(p)}
          />
        ))}

        {activo && (
          <InfoWindow
            position={activo.position}
            onCloseClick={() => setActivo(null)}
          >
            <div style={{padding: "8px"}}>
              <h3>{activo.name}</h3>
            </div>
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  );
}