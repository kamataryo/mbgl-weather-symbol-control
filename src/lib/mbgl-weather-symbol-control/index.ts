import mapboxgl from "mapbox-gl";
import symbols from "./symbols";

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
type WindPower = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

const windDir = {
  0: "北",
  1: "北北東",
  2: "北東",
  3: "東北東",
  4: "東",
  5: "東南東",
  6: "南東",
  7: "南南東",
  8: "南",
  9: "南南西",
  10: "南西",
  11: "西南西",
  12: "西",
  13: "西北西",
  14: "北西",
  15: "北北西"
};
type DirectionRank =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15;

export class WeatherSymbolControl {
  private container: HTMLDivElement;
  private map?: mapboxgl.Map;
  private weathers: GeoJSON.FeatureCollection<GeoJSON.Point>;

  private selectedWeather: keyof typeof symbols = "unknown";

  private currentCenter?: mapboxgl.Point;
  private currentMarker?: mapboxgl.Marker;
  private windMarkerTransformBaseString: string = "";

  constructor() {
    this.container = document.createElement("div");
    this.container.className = "mapboxgl-ctrl mapboxgl-ctrl-group";

    Object.keys(symbols).forEach((key: string) => {
      const button = document.createElement("button");
      button.className = "weather-select-button";
      const { symbol, subscript } = symbols[key as keyof typeof symbols];
      button.innerHTML = `<img src="${symbol}" class="weather-selector" />`;
      button.innerHTML += subscript
        ? `<span class="subscript">${subscript}</span>`
        : "";
      button.addEventListener("click", () => {
        const selected = document.querySelector(
          ".weather-select-button.selected"
        );
        selected && selected.classList.remove("selected");
        button.classList.add("selected");
        this.selectedWeather = key as keyof typeof symbols;
      });
      this.container.appendChild(button);
    });

    this.weathers = {
      type: "FeatureCollection",
      features: []
    };
  }

  onAdd(map: mapboxgl.Map) {
    map.on("click", this.onMapClick(map));
    map.on("mousemove", this.onMapMouseMove);
    // map.on("keydown", this.onMapKeyDown);
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
      weatherElement.setAttribute("src", symbols[this.selectedWeather].symbol);
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

  private onMapMouseMove = (e: mapboxgl.MapMouseEvent) => {
    if (this.currentCenter && this.currentMarker) {
      const currentCenter = e.point;
      const dx = currentCenter.x - this.currentCenter.x;
      const dy = currentCenter.y - this.currentCenter.y;

      const directionRank =
        4 + Math.floor((16 * ((Math.atan2(dy, dx) * 180) / Math.PI)) / 360);
      const direction = directionRank * (360 / 16);

      const bilateralCoefficient = 20;
      const windPower = Math.floor(
        Math.min(12, (dx ** 2 + dy ** 2) ** 0.5 / bilateralCoefficient)
      ) as WindPower;

      const windElement = this.currentMarker
        .getElement()
        .querySelector(".wind");

      // const windDirKey = (directionRank < 0
      //   ? 16 + directionRank
      //   : directionRank) as DirectionRank;

      if (windElement) {
        windElement.setAttribute("src", wind[windPower]);
        (windElement as HTMLImageElement).style.transform =
          this.windMarkerTransformBaseString + `rotate(${direction}deg)`;
        // this.container.innerHTML = `${windDir[windDirKey]}の風 風力${windPower} 天気は不明`;
      }
    }
  };

  // private onMapKeyDown = (e: any) => {
  //   alert(1);
  //   if (this.currentCenter && this.currentMarker) {
  //     const weatherElement = this.currentMarker
  //       .getElement()
  //       .querySelector(".weather");
  //
  //     if (weatherElement) {
  //       weatherElement.setAttribute("src", symbols.snow.symbol);
  //     }
  //   }
  // };

  onRemove() {
    this.container.parentNode &&
      this.container.parentNode.removeChild(this.container);
  }

  getDefaultPosition = () => "top-left";
}
