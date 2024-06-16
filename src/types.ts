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

export interface Position {
  participantNumber: string;
  latitude: number;
  longitude: number;
  isInPit: boolean;
  isRetired: boolean;
  isOfficialCar: boolean;
  participant: Participant;
  __typename: string;
}

export interface Participant {
  id: string;
  category: Category;
  __typename: string;
}

export interface Category {
  id: string;
  color: string;
  __typename: string;
}
