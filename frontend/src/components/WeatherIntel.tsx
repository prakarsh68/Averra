type Props = {
  weather: {
    temperature: number;
    humidity: number;
    wind_speed: number;
    rain_risk: string;
  };
};

const WeatherIntel = ({ weather }: Props) => {
  return (
    <div className="border border-cyan-500/20 bg-cyan-950/5 rounded-sm p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-cyan-400 font-black tracking-widest uppercase">
          Weather Intelligence
        </h3>

        <span className="text-xs text-cyan-400 animate-pulse">
          LIVE
        </span>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div>
          <p className="text-xs opacity-60">Temperature</p>
          <p className="text-2xl font-black text-white">{weather.temperature}°C</p>
        </div>

        <div>
          <p className="text-xs opacity-60">Humidity</p>
          <p className="text-2xl font-black text-white">{weather.humidity}%</p>
        </div>

        <div>
          <p className="text-xs opacity-60">Wind Speed</p>
          <p className="text-2xl font-black text-white">{weather.wind_speed} km/h</p>
        </div>

        <div>
          <p className="text-xs opacity-60">Rain Risk</p>
          <p className="text-2xl font-black text-red-500">{weather.rain_risk.toUpperCase()}</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherIntel;