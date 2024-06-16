import moment from "moment";
import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  GeoJSON,
  FeatureGroup,
  useMapEvents,
  Polyline,
  Circle,
} from "react-leaflet";
import { type Map, Position, Radar, WeatherMaps } from "./types";
import { EditControl } from "react-leaflet-draw";
import { geojsonfeature } from "./data";
import { LatLngLiteral } from "leaflet";
// import { JSONTree } from "react-json-tree";

const getMostRecentWeatherMap = async (): Promise<{
  time: number;
  path: string;
}> => {
  const res = await fetch(
    "https://api.rainviewer.com/public/weather-maps.json"
  );
  const resJson = await res.json();

  return {
    path: resJson.radar.nowcast[0].path,
    time: resJson.radar.nowcast[0].time,
  };
};

const getWeatherMaps = async (): Promise<Radar> => {
  const res = await fetch(
    "https://api.rainviewer.com/public/weather-maps.json"
  );
  const resJson = (await res.json()) as WeatherMaps;

  return resJson.radar;
};

const MapEvent = ({
  setStartLatLong,
  setEndLatLong,
  setImpactLatLong,
  startLatLong,
  endLatLong,
}: {
  setStartLatLong: (latLong: [number, number]) => void;
  setEndLatLong: (latLong: [number, number]) => void;
  setImpactLatLong: (latLong: [number, number]) => void;
  startLatLong: [number, number] | null | undefined;
  endLatLong: [number, number] | null | undefined;
}) => {
  useMapEvents({
    click(e) {
      if (!startLatLong) {
        setStartLatLong([e.latlng.lat, e.latlng.lng]);
      } else if (!endLatLong) {
        setEndLatLong([e.latlng.lat, e.latlng.lng]);
      } else {
        setImpactLatLong([e.latlng.lat, e.latlng.lng]);
      }
    },
  });

  return <></>;
};

function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function calculateDistance(
  startLatLong: [number, number],
  endLatLong: [number, number]
): number {
  const earthRadiusKm = 6371; // Radius of the Earth in kilometers

  const lat1 = startLatLong[0];
  const lon1 = startLatLong[1];
  const lat2 = endLatLong[0];
  const lon2 = endLatLong[1];

  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadians(lat1)) *
      Math.cos(degreesToRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadiusKm * c; // Distance in kilometers

  return distance;
}

function calculateSpeed(distanceKm: number, timeMinutes: number): number {
  // Convert minutes to hours
  const timeHours = timeMinutes / 60;

  // Calculate speed (distance / time)
  const speedKph = distanceKm / timeHours;

  return speedKph;
}

interface InfiniteLineProps {
  point1: LatLngLiteral;
  point2: LatLngLiteral;
}

const InfiniteLine: React.FC<InfiniteLineProps> = ({ point1, point2 }) => {
  const [lineLatLngs, setLineLatLngs] = useState<LatLngLiteral[]>([]);

  useEffect(() => {
    const calculateInfiniteLine = () => {
      // Calculate slope and intercept
      const slope = (point2.lng - point1.lng) / (point2.lat - point1.lat);
      const intercept = point1.lng - slope * point1.lat;

      // Extend the line beyond point1
      const extendFactor = 1; // Adjust for the length of the line

      // Calculate points far beyond map bounds
      const p1Extended = {
        lat: point1.lat - extendFactor,
        lng: slope * (point1.lat - extendFactor) + intercept,
      };
      const p2Extended = {
        lat: point1.lat + extendFactor,
        lng: slope * (point1.lat + extendFactor) + intercept,
      };

      return [p1Extended, p2Extended];
    };

    setLineLatLngs(calculateInfiniteLine());
  }, [point1, point2]);

  return <Polyline positions={lineLatLngs} />;
};

export default function Map() {
  const [mapPath, setMapPath] = useState<string | null>(null);
  const [time, setTime] = useState<number | null>(null);
  const [weatherMaps, setWeatherMaps] = useState<Map[] | null>(null);

  const [startLatLong, setStartLatLong] = useState<[number, number] | null>();
  const [endLatLong, setEndLatLong] = useState<[number, number] | null>();
  const [impactLatLong, setImpactLatLong] = useState<[number, number] | null>();

  const [distance1, setDistance1] = useState<number | null>(null);
  const [speed, setSpeed] = useState<number | null>(null);

  const [impactTime, setImpactTime] = useState<number | null>(null);

  const [positions, setPositions] = useState<Position[]>([]);

  useEffect(() => {
    const ws = new WebSocket("wss://live-timing-api.sportall.tv/graphql", [
      "graphql-transport-ws",
    ]);

    ws.onopen = function () {
      console.log("Connected to websocket");

      // Init connection
      ws.send(
        JSON.stringify({ type: "connection_init", payload: { locale: "en" } })
      );
    };

    ws.onmessage = function (event) {
      const data = JSON.parse(event.data);

      if (data.type === "connection_ack") {
        console.log("Connection ack");

        ws.send(
          JSON.stringify({
            id: "59cedfcc-d219-4b13-904e-1d72136da514",
            type: "subscribe",
            payload: {
              variables: { sessionId: "7317", filters: {} },
              extensions: {},
              operationName: "Positions",
              query:
                "subscription Positions($sessionId: ID!, $filters: SessionParticipantsFilters) {\n  positions(sessionId: $sessionId, filters: $filters) {\n    ...Position\n    __typename\n  }\n}\n\nfragment Position on Position {\n  participantNumber\n  latitude\n  longitude\n  isInPit\n  isRetired\n  isOfficialCar\n  participant {\n    id\n    category {\n      id\n      color\n      __typename\n    }\n    __typename\n  }\n  __typename\n}",
            },
          })
        );
      }

      if (data.id === "59cedfcc-d219-4b13-904e-1d72136da514") {
        setPositions(data.payload.data.positions);
        console.log(JSON.stringify(data.payload.data.positions[0]));
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    if (startLatLong && endLatLong) {
      const distance = calculateDistance(startLatLong, endLatLong);
      setDistance1(distance);

      setSpeed(calculateSpeed(distance, 10));
    }
  }, [startLatLong, endLatLong]);

  useEffect(() => {
    if (endLatLong && impactLatLong && speed && time) {
      const distance = calculateDistance(endLatLong, impactLatLong);
      const timeHours = distance / speed;
      const timeMinutes = timeHours * 60;

      const impactTime = time + timeMinutes * 60;

      setImpactTime(impactTime);
      console.log("Impact time", moment(impactTime * 1000).format("LLL"));
    }
  }, [endLatLong, impactLatLong, speed, time]);

  useEffect(() => {
    (async () => {
      const { path, time } = await getMostRecentWeatherMap();
      setMapPath(path);
      setTime(time);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const weatherMaps = await getWeatherMaps();
      setWeatherMaps([...weatherMaps.past, ...weatherMaps.nowcast]);
    })();
  }, []);

  if (!mapPath) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="selectTime">
        <select
          name="selectTime"
          id="selectTime"
          onChange={(e) => {
            const { time, path } = JSON.parse(e.target.value);
            setMapPath(path);
            setTime(time);
          }}
        >
          {weatherMaps?.map((map) => (
            <option
              key={map.time}
              value={JSON.stringify({
                time: map.time,
                path: map.path,
              })}
              selected={map.time === time}
            >
              {moment(map.time * 1000).format("LLL")}
            </option>
          ))}
        </select>
        <p>
          How to use the impact time tool: Click on the map to place a start
          point, go <b>10 MINUTES FORWARD</b> (aka next frame), click on the
          same weather point, it will calculate the speed of the storm. Then
          click on the impact point and you will receive the impact time. Make
          sure to place the start point first, then the end point, and finally
          the impact point. And make sure to place them in the direction of the
          movement of the storm.
        </p>
      </div>
      <MapContainer center={[47.956378, 0.208095]} zoom={13}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <TileLayer
          attribution={`RainViewer.com - ${moment((time ?? 0) * 1000).format(
            "LLL"
          )}`}
          url={`https://tilecache.rainviewer.com${mapPath}/1024/{z}/{x}/{y}/3/1_1.png`}
          opacity={0.7}
          zIndex={2}
        />

        {/* @ts-expect-error the types are ass */}
        <GeoJSON data={geojsonfeature} />

        <FeatureGroup>
          <EditControl
            position="topright"
            draw={{
              rectangle: true,
            }}
          />
        </FeatureGroup>

        <MapEvent
          endLatLong={endLatLong}
          startLatLong={startLatLong}
          setImpactLatLong={setImpactLatLong}
          setStartLatLong={setStartLatLong}
          setEndLatLong={setEndLatLong}
        />

        {startLatLong && (
          <Marker position={startLatLong ?? [0, 0]}>
            <Popup>Start position</Popup>
          </Marker>
        )}
        {endLatLong && (
          <Marker position={endLatLong ?? [0, 0]}>
            <Popup>
              End position (Distance {distance1}km, {speed}kph)
            </Popup>
          </Marker>
        )}
        {impactLatLong && impactTime && (
          <Marker position={impactLatLong ?? [0, 0]}>
            <Popup>
              Impact position ({moment(impactTime * 1000).format("LLL")})
            </Popup>
          </Marker>
        )}

        {startLatLong && endLatLong && (
          <InfiniteLine
            point1={{ lat: startLatLong[0], lng: startLatLong[1] }}
            point2={{ lat: endLatLong[0], lng: endLatLong[1] }}
          />
        )}

        {positions.map((position) => (
          <Circle
            center={[position.latitude, position.longitude]}
            radius={50}
            color={position.participant.category.color}
          >
            <Popup>#{position.participantNumber}</Popup>
          </Circle>
        ))}
      </MapContainer>

      {/* <JSONTree data={weatherMaps} /> */}
    </>
  );
}
