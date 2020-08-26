import React from "react";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";

const mapStyles = {};
export function MapContainer(props) {
  return (
    <div className="map-wrapper">
      <Map
        google={props.google}
        zoom={17}
        style={mapStyles}
        initialCenter={{ lat: 45.494613, lng: -73.577369 }}
      >
        <Marker position={{ lat: 45.494613, lng: -73.577369 }} />
      </Map>
    </div>
  );
}

export default GoogleApiWrapper({
  apiKey: "",
})(MapContainer);
