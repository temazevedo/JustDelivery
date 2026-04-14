import './Templates.css'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import "leaflet/dist/leaflet.css";
import { useRef } from 'react'
import { useMemo } from 'react'

import Button from "react-bootstrap/Button";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

function MapViewer({ point, updateMarker }) {

  const [position, setPosition] = useState(point)
  const markerRef = useRef(null)



  delete L.Icon.Default.prototype._getIconUrl

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
  });



  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const { lat, lng } = marker.getLatLng();
          setPosition([lat, lng]);
        }
      },
    }),
    []
  );

  function saveMarker() {
    updateMarker(position)
  }

  return (<>
    <p>Please drag marker for aproximate location</p>
    <Button onClick={saveMarker} >Update Marker</Button>
    <MapContainer
      center={position}
      zoom={20}
      style={{ height: '60vh', width: '60vw' }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <Marker
        draggable={true}
        eventHandlers={eventHandlers}
        position={position}
        ref={markerRef}
      />

    </MapContainer>
  </>)
}

export default MapViewer