import React, { useState, useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { BarometricControl } from "../lib/mbgl-barometric-control";
import { WeatherSymbolControl } from "../lib/mbgl-weather-symbol-control";

export const Map: React.FC = () => {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const mapContainer = useRef();

  useEffect(() => {
    if (!map) {
      const container = mapContainer.current;
      // @ts-ignore
      const map = new mapboxgl.Map({
        container,
        zoom: 3,
        center: [135, 35],
        style:
          "https://api.geolonia.com/v1/styles/tilecloud-basic?key=YOUR-API-KEY"
      });

      map.addControl(new mapboxgl.NavigationControl());
      map.addControl(new WeatherSymbolControl());
      setMap(map);
    }
  }, [map]);

  return (
    <div
      // @ts-ignore
      ref={mapContainer}
      style={{ width: "100%", height: "100%", border: "1px solid #ccc" }}
    ></div>
  );
};

export default Map;
