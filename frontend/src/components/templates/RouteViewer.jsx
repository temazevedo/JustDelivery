import "./Templates.css";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Polyline,
} from "react-leaflet";
import L, { polyline } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useRef } from "react";
import { useMemo } from "react";

import Button from "react-bootstrap/Button";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

function formatDistance(meters) {
  return meters < 1000
    ? `${meters.toFixed(0)} m`
    : `${(meters / 1000).toFixed(2)} km`;
}

function formatDuration(seconds) {
  const min = Math.round(seconds / 60);
  const h = Math.floor(min / 60);
  const m = min % 60;

  return h > 0 ? `${h} h:${m} min` : `${m} min`;
}

function RouteViewer({ routeInfo, markers, centerCoords }) {
  const [points, setPoints] = useState([]);
  const [route, setRoute] = useState(null);
  const [orderedPoints, setOrderedPoints] = useState([]);
  const [stats, setStats] = useState(null);

  const markerRef = useRef(null);


  delete L.Icon.Default.prototype._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
  });

  useEffect(() => {
    showRoute();
  }, [routeInfo]);

  function showRoute() {
    const { geometry, order, distance, duration } = routeInfo;
    const polyline = geometry.coordinates.map(([lng, lat]) => [lat, lng]);

    setRoute(polyline);

    const sortedPoints = order.map((i) => points[i]);

    setOrderedPoints(sortedPoints);
    setStats({ distance, duration });
  }

  return (
    <>
      {
        stats &&
      <div className="stats">{formatDistance(stats.distance)} | {formatDuration(stats.duration)}</div>
      }

      <MapContainer
        center={centerCoords}
        zoom={13}
        style={{ height: "60vh", width: "60vw" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markers.map((m) => (
          <Marker key={m.id} position={m} />
        ))}

        <Polyline
          positions={route}
          pathOptions={{ color: "red", weight: 5 }}
        />
      </MapContainer>
    </>
  );
}

export default RouteViewer;
