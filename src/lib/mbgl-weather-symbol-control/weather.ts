import unknown from "./images/unnknown.png";
import snowstorm from "./images/snowstorm.png";
import sandstorm from "./images/sandstom.png";
import dusthaze from "./images/dusthaze.png";
import haze from "./images/haze.png";
import hail from "./images/hail.png";
import hailstone from "./images/hailstone.png";
import snow from "./images/snow.png";
import thunder from "./images/thunder.png";
import sleet from "./images/sleet.png";
import fog from "./images/fog.png";
import cloudy from "./images/cloudy.png";
import sunny from "./images/sunny.png";
import clear from "./images/clear.png";
import rain from "./images/rain.png";

export default {
  clear: { symbol: clear, name: "快晴", subscript: "" },
  sunny: { symbol: sunny, name: "晴", subscript: "" },
  cloudy: { symbol: cloudy, name: "曇", subscript: "" },
  fog: { symbol: fog, name: "霧", subscript: "" },
  drizzle: { symbol: rain, name: "霧雨", subscript: "キ" },
  rain: { symbol: rain, name: "雨", subscript: "" },
  heavyRain: { symbol: rain, name: "雨強し", subscript: "ツ" },
  shower: { symbol: rain, name: "にわか雨", subscript: "ニ" },
  sleet: { symbol: sleet, name: "みぞれ", subscript: "" },
  thunder: { symbol: thunder, name: "雷", subscript: "" },
  intenseThunder: { symbol: thunder, name: "雷強し", subscript: "ツ" },
  snow: { symbol: snow, name: "雪", subscript: "" },
  heavySnow: { symbol: snow, name: "雪強し", subscript: "ツ" },
  snowFlurry: { symbol: snow, name: "にわか雪", subscript: "ニ" },
  hailstone: { symbol: hailstone, name: "あられ", subscript: "" },
  hail: { symbol: hail, name: "ひょう", subscript: "" },
  haze: { symbol: haze, name: "煙霧", subscript: "" },
  dusthaze: { symbol: dusthaze, name: "塵煙霧", subscript: "" },
  sandstorm: { symbol: sandstorm, name: "砂塵嵐", subscript: "" },
  snowstorm: { symbol: snowstorm, name: "地吹雪", subscript: "" },
  unknown: { symbol: unknown, name: "不明", subscript: "" }
};
