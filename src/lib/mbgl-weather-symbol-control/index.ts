import mapboxgl from "mapbox-gl";
import weathers from "./weather";
import { windSymbols, windDirections } from "./wind";
import "./style.css";

export class WeatherSymbolControl {
  private container: HTMLDivElement;

  private selectedWeather?: keyof typeof weathers;
  private currentCenter?: mapboxgl.Point;
  private currentLngLat?: mapboxgl.LngLat;
  private currentMarker?: mapboxgl.Marker;
  private windMarkerTransformBaseString: string = "";

  constructor() {
    const container = document.createElement("div");

    const buttonControlGroup = document.createElement("div");
    buttonControlGroup.className = "buttons mapboxgl-ctrl mapboxgl-ctrl-group";

    const indicatorControlGroup = document.createElement("div");
    indicatorControlGroup.className =
      "weather-indicator mapboxgl-ctrl mapboxgl-ctrl-group";

    Object.keys(weathers).forEach(_key => {
      const key = _key as keyof typeof weathers;
      const { symbol, subscript } = weathers[key];

      const button = document.createElement("button");
      button.className = "weather-select-button";
      button.innerHTML = `<img src="${symbol}" class="weather-selector" />`;
      button.innerHTML += subscript
        ? `<span class="subscript">${subscript}</span>`
        : "";
      button.addEventListener("click", () => {
        if (this.selectedWeather === key) {
          button.classList.remove("selected");
          this.selectedWeather = void 0;
          this.indicate("");
        } else {
          const selected = document.querySelector(
            ".weather-select-button.selected"
          );
          selected && selected.classList.remove("selected");
          button.classList.add("selected");
          this.selectedWeather = key;
        }
      });
      buttonControlGroup.appendChild(button);
    });

    container.appendChild(buttonControlGroup);
    container.appendChild(indicatorControlGroup);

    this.container = container;
  }

  onAdd(map: mapboxgl.Map) {
    map.on("click", this.onMapClick(map));
    map.on("mousemove", this.onMapMouseMove);
    map.on("touchmove", this.onMapMouseMove);
    return this.container;
  }

  private onMapClick = (map: mapboxgl.Map) => (e: mapboxgl.MapMouseEvent) => {
    if (this.currentCenter || !this.selectedWeather) {
      this.currentCenter = void 0;
      this.currentMarker = void 0;
      this.windMarkerTransformBaseString = "";
    } else {
      this.currentCenter = e.point;
      this.currentLngLat = e.lngLat;

      const weatherElement = document.createElement("img");
      weatherElement.setAttribute("src", weathers[this.selectedWeather].symbol);
      weatherElement.setAttribute("class", "weather");

      const windElement = document.createElement("img");
      windElement.setAttribute("src", windSymbols[0]);
      windElement.setAttribute("alt", "");
      windElement.setAttribute("class", "wind");

      const weatherWindElement = document.createElement("div");
      weatherWindElement.setAttribute("class", "weather-wind-wrap");
      weatherWindElement.appendChild(weatherElement);
      weatherWindElement.appendChild(windElement);

      if (weathers[this.selectedWeather].subscript) {
        const subscriptElement = document.createElement("span");
        subscriptElement.setAttribute("class", "weather-subscript");
        subscriptElement.innerText = weathers[this.selectedWeather].subscript;
        weatherWindElement.appendChild(subscriptElement);
      }

      const marker = new mapboxgl.Marker({
        element: weatherWindElement,
        draggable: true
      });

      marker.setLngLat(e.lngLat).addTo(map);

      this.currentMarker = marker;
    }
  };

  private onMapMouseMove = (e: mapboxgl.MapMouseEvent) => {
    let labelText = "";

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
      ) as keyof typeof windSymbols;

      const windElement = this.currentMarker
        .getElement()
        .querySelector(".wind");

      if (windElement) {
        windElement.setAttribute("src", windSymbols[windPower]);
        (windElement as HTMLImageElement).style.transform =
          this.windMarkerTransformBaseString + `rotate(${direction}deg)`;
      }

      if (this.selectedWeather) {
        const weather = weathers[this.selectedWeather].name;
        const windDirKey = (directionRank < 0
          ? 16 + directionRank
          : directionRank) as keyof typeof windDirections;
        const windDirection = windDirections[windDirKey];
        labelText += `${windDirection}の風 風力${windPower} 天気は${weather}`;
      }
    }

    const latitude =
      e.lngLat.lat >= 0
        ? `北緯 ${e.lngLat.lat}`
        : `南緯 ${Math.abs(e.lngLat.lat)}`;
    labelText += latitude;

    this.indicate(labelText);
  };

  private indicate(text: string) {
    const indicator = this.container.querySelector(".weather-indicator");
    if (indicator) {
      indicator.innerHTML = text;
    }
  }

  onRemove() {
    this.container.parentNode &&
      this.container.parentNode.removeChild(this.container);
  }

  getDefaultPosition = () => "top-left";
}
