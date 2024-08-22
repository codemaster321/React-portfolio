import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { forwardRef } from "react";

const MapView = forwardRef(function MapView(props, ref) {
  const position = [26.4466159, 80.325814];
  return (
    <div ref={ref} id="map">
      <MapContainer center={position} zoom={10} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          style={{
            height: "400px",
            backgroundColor: "red",
            marginTop: "80px",
            marginBottom: "90px",
          }}
        />
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
});

export default MapView;
