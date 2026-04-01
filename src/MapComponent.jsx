import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Tooltip,
  useMap,
  Marker,
  Popup
} from "react-leaflet";

import { buildings } from "./buildings";
import { useEffect, useState } from "react";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

/* 🔥 Buildings Layer */
function BuildingPolygons({ onSelectBuilding }) {
  const map = useMap();

  return (
    <>
      {buildings.map((b, i) => (
        <Polygon
          key={i}
          positions={b.coordinates}
          pathOptions={{
            color: b.model ? "#ff4d4d" : "#ffd633",
            fillColor: b.model ? "#ff4d4d" : "#ffd633",
            fillOpacity: 0.35,
            weight: 1.5
          }}
          eventHandlers={{
            click: (e) => {
              map.fitBounds(e.target.getBounds(), {
                padding: [50, 50],
                maxZoom: 19
              });

              if (b.model) {
                onSelectBuilding(b);
              } else {
                alert(b.name + " (No 3D model yet)");
              }
            },
            mouseover: (e) => {
              e.target.setStyle({ fillOpacity: 0.6, weight: 2 });
            },
            mouseout: (e) => {
              e.target.setStyle({ fillOpacity: 0.35, weight: 1.5 });
            }
          }}
        >
          <Tooltip
            permanent
            direction="top"
            offset={[0, -8]}
            className="map-label"
          >
            <span className="label-content">
              <span>{b.icon}</span> {b.name}
            </span>
          </Tooltip>
        </Polygon>
      ))}
    </>
  );
}

/* 📍 USER GPS */
function UserLocation() {
  const map = useMap();
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setPosition([lat, lng]);
        map.setView([lat, lng], 18);
      },                                 
      (err) => console.error(err),
      { enableHighAccuracy: true,
         maximumAge: 0,        // ❗ no cache
    timeout: 5000
       }
    );

    return () => navigator.geolocation.clearWatch(id); // ✅ cleanup
  }, [map]);

  if (!position) return null;

  return (
    <Marker position={position}>
      <Popup>📍 You are here</Popup>
    </Marker>
  );
}

/* 🗺️ MAIN MAP */
export default function MapComponent({ onSelectBuilding }) {
  return (
    <MapContainer
      center={[23.17619, 80.02679]}
      zoom={18}
      minZoom={16}
      maxZoom={20}
      style={{ height: "100vh", width: "100%" }}
    >
      {/* 🛰️ Satellite */}
      <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />

      {/* 🏷️ Labels */}
      <TileLayer url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}" />

      <BuildingPolygons onSelectBuilding={onSelectBuilding} />

      {/* ✅ ADD THIS (GPS) */}
      <UserLocation />
    </MapContainer>
  );
}