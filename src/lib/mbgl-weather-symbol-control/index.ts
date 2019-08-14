import mapboxgl from "mapbox-gl";
import unknown from "./images/unnknown.png";
import wind12 from "./images/wind-12.png";
import wind11 from "./images/wind-11.png";
import wind10 from "./images/wind-10.png";
import wind09 from "./images/wind-09.png";
import wind08 from "./images/wind-08.png";
import wind07 from "./images/wind-07.png";
import wind06 from "./images/wind-06.png";
import wind05 from "./images/wind-05.png";
import wind04 from "./images/wind-04.png";
import wind03 from "./images/wind-03.png";
import wind02 from "./images/wind-02.png";
import wind01 from "./images/wind-01.png";

import "./style.css";

const wind = {
  0: "",
  1: wind01,
  2: wind02,
  3: wind03,
  4: wind04,
  5: wind05,
  6: wind06,
  7: wind07,
  8: wind08,
  9: wind09,
  10: wind10,
  11: wind11,
  12: wind12
};

export class WeatherSymbolControl {
  private container: HTMLDivElement;
  private addButton: HTMLButtonElement;
  private map?: mapboxgl.Map;
  private weathers: GeoJSON.FeatureCollection<GeoJSON.Point>;

  private currentCenter?: mapboxgl.Point;
  private currentMarker?: mapboxgl.Marker;
  private windMarkerTransformBaseString: string = "";

  constructor() {
    this.container = document.createElement("div");
    this.container.className = "mapboxgl-ctrl mapboxgl-ctrl-group";

    this.addButton = document.createElement("button");
    this.addButton.className = "mapboxgl-ctrl-icon mapboxgl-ctrl-zoom-in";
    this.addButton.setAttribute("type", "button");
    this.addButton.setAttribute("title", "add weather point");
    this.addButton.setAttribute("aria-label", "add weather point");

    this.container.appendChild(this.addButton);
    this.weathers = {
      type: "FeatureCollection",
      features: []
    };
  }

  onAdd(map: mapboxgl.Map) {
    map.on("click", this.onMapClick(map));
    map.on("mousemove", this.onMapMouseMove(map));
    map.on("transform", () => console.log(1));
    return this.container;
  }

  private onMapClick = (map: mapboxgl.Map) => (e: mapboxgl.MapMouseEvent) => {
    if (this.currentCenter) {
      this.currentCenter = void 0;
      this.currentMarker = void 0;
      this.windMarkerTransformBaseString = "";
    } else {
      this.currentCenter = e.point;

      const weatherElement = document.createElement("img");
      weatherElement.setAttribute("src", unknown);
      weatherElement.setAttribute("class", "weather");

      const windElement = document.createElement("img");
      windElement.setAttribute("src", wind[0]);
      windElement.setAttribute("alt", "");
      windElement.setAttribute("class", "wind");

      const weatherWindElement = document.createElement("div");
      weatherWindElement.setAttribute("class", "weather-wind-wrap");
      weatherWindElement.appendChild(weatherElement);
      weatherWindElement.appendChild(windElement);

      const marker = new mapboxgl.Marker({
        element: weatherWindElement,
        draggable: true
      });

      marker.setLngLat(e.lngLat).addTo(map);

      this.currentMarker = marker;
    }
  };

  private onMapMouseMove = (map: mapboxgl.Map) => (
    e: mapboxgl.MapMouseEvent
  ) => {
    if (this.currentCenter && this.currentMarker) {
      const currentCenter = e.point;
      const dx = currentCenter.x - this.currentCenter.x;
      const dy = currentCenter.y - this.currentCenter.y;

      const direction =
        (4 + Math.floor((16 * ((Math.atan2(dy, dx) * 180) / Math.PI)) / 360)) *
        (360 / 16);

      const bilateralCoefficient = 20;
      const windPower = Math.floor(
        Math.min(12, (dx ** 2 + dy ** 2) ** 0.5 / bilateralCoefficient)
      );

      const windElement = this.currentMarker
        .getElement()
        .querySelector(".wind");

      console.log(this.currentMarker.getElement());

      if (windElement) {
        // @ts-ignore
        windElement.setAttribute("src", wind[windPower]);
        // @ts-ignore
        windElement.style.transform =
          this.windMarkerTransformBaseString + `rotate(${direction}deg)`;
      }
    }
  };

  onRemove() {
    this.container.parentNode &&
      this.container.parentNode.removeChild(this.container);
  }

  getDefaultPosition = () => "top-left";
}
