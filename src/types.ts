export interface WeatherMaps {
  version: string;
  generated: number;
  host: string;
  radar: Radar;
  satellite: Satellite;
}

export interface Radar {
  past: Map[];
  nowcast: Map[];
}

export interface Map {
  time: number;
  path: string;
}

export interface Satellite {
  infrared: Infrared[];
}

export interface Infrared {
  time: number;
  path: string;
}
