import moment from "moment";
import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  GeoJSON,
  FeatureGroup,
} from "react-leaflet";
import { type Map, Radar, WeatherMaps } from "./types";
import { EditControl } from "react-leaflet-draw";
// import { JSONTree } from "react-json-tree";

const geojsonfeature = {
  id: "track",
  type: "Feature",
  bbox: [0.20745, 47.94806, 0.21851, 47.95912],
  properties: {
    i1: 1.89909,
    i2: 7.67063,
  },
  geometry: {
    type: "LineString",
    coordinates: [
      [0.2075370789264112, 47.94987240911841],
      [0.2076340773985446, 47.95192125692844],
      [0.2076661000103039, 47.95248379296207],
      [0.2077084866146642, 47.95294915142795],
      [0.2077400439094738, 47.9532165366943],
      [0.207813057174517, 47.95349086311228],
      [0.2079487197120591, 47.95397010473847],
      [0.208139822082458, 47.95444042437389],
      [0.2083567784966552, 47.95488762555827],
      [0.2085091087960721, 47.95511751927525],
      [0.2086363807570376, 47.95529706732258],
      [0.2088516839368261, 47.9555136178161],
      [0.2090669871166146, 47.9556630412698],
      [0.2092603642502013, 47.95576211982548],
      [0.2097168539344007, 47.95596188838435],
      [0.2104105728436525, 47.95624185634331],
      [0.2107417708367747, 47.95637974263289],
      [0.2109011052495757, 47.9564549788219],
      [0.2109915292315217, 47.95651762892248],
      [0.2110428896668259, 47.95662626179319],
      [0.2110004708123741, 47.95675844590426],
      [0.2109580519579223, 47.95689063001534],
      [0.2109302861172062, 47.95701496359376],
      [0.2109494099218655, 47.95711574610098],
      [0.2110916190429847, 47.95720867825348],
      [0.2112689953980929, 47.95727805941339],
      [0.212582504537162, 47.95784095987642],
      [0.212883041095803, 47.95797579788183],
      [0.2131601328317848, 47.95814988694173],
      [0.2133610288957439, 47.95830435056565],
      [0.2135853697807708, 47.95852946564106],
      [0.2138009188585083, 47.95872317968316],
      [0.2140868024025752, 47.95892474382164],
      [0.2142906290689831, 47.95903210712531],
      [0.2145156277187891, 47.95910933891648],
      [0.2146937367248115, 47.95917087062619],
      [0.2148750259338174, 47.9592198569562],
      [0.2151009012318415, 47.95926014974362],
      [0.2152795940361775, 47.95928148482339],
      [0.2154816408071674, 47.95929886578737],
      [0.2157214335731305, 47.95930360829126],
      [0.2160594716266641, 47.95930677406682],
      [0.2163409745694436, 47.95930922637019],
      [0.2165847315198078, 47.95932431713062],
      [0.2167763367716177, 47.95933024684367],
      [0.2169490690259411, 47.95936145345857],
      [0.2171062228531543, 47.95941186064992],
      [0.2172256306855081, 47.95946226784126],
      [0.2174101728083664, 47.95959563163802],
      [0.2175443122269106, 47.95974920744754],
      [0.2175873161299958, 47.95986186363787],
      [0.2176088180815383, 47.95998676767493],
      [0.2176122544032254, 47.96012269358197],
      [0.2176212872180963, 47.96025433377143],
      [0.2176477475877276, 47.96036913624046],
      [0.2177121803498537, 47.96050001065549],
      [0.2177912424200914, 47.96059169941672],
      [0.2179010098239101, 47.96067216840126],
      [0.2180450543505907, 47.96076613833439],
      [0.2185807129058425, 47.96104995510018],
      [0.2188188219087293, 47.96116798194808],
      [0.2190448694005975, 47.96127077932171],
      [0.2192648861369279, 47.96133809951029],
      [0.2196542650913915, 47.96145534650158],
      [0.2200807727148277, 47.96156969447229],
      [0.2206142733286319, 47.9617079243119],
      [0.2212613848675344, 47.96185466515783],
      [0.2214500137104959, 47.96186952624684],
      [0.2216326984974581, 47.96183662323132],
      [0.2220925723031031, 47.96168086136357],
      [0.2225048936679152, 47.96150917828368],
      [0.2229891443434246, 47.96129809119431],
      [0.2234333675525879, 47.96107711783766],
      [0.2237230453304365, 47.96089594796776],
      [0.2240733649590109, 47.96066482793427],
      [0.2243999083671687, 47.96040186485001],
      [0.2269922162571242, 47.95772145669916],
      [0.2276125284507507, 47.95680416781415],
      [0.22934, 47.953332],
      [0.233266, 47.945075],
      [0.233299, 47.944924],
      [0.233202, 47.944838],
      [0.233041, 47.944673],
      [0.232912, 47.944529],
      [0.232869, 47.944392],
      [0.232869, 47.944249],
      [0.232977, 47.944141],
      [0.233223, 47.944011],
      [0.233459, 47.943868],
      [0.233749, 47.943702],
      [0.233932, 47.943595],
      [0.23405, 47.943422],
      [0.234339, 47.942782],
      [0.236292, 47.938671],
      [0.241163, 47.928579],
      [0.241238, 47.928428],
      [0.241388, 47.92832],
      [0.241785, 47.928227],
      [0.242096, 47.928105],
      [0.242214, 47.927939],
      [0.242257, 47.927781],
      [0.242203, 47.927659],
      [0.242139, 47.927436],
      [0.241925, 47.927005],
      [0.242622, 47.925596],
      [0.242858, 47.925078],
      [0.242976, 47.924603],
      [0.243834, 47.915084],
      [0.243856, 47.914746],
      [0.243813, 47.914508],
      [0.243448, 47.913638],
      [0.243373, 47.91348],
      [0.243212, 47.913437],
      [0.233814, 47.91512],
      [0.226947, 47.917471],
      [0.225896, 47.917974],
      [0.221014, 47.920455],
      [0.220585, 47.92075],
      [0.22036, 47.921059],
      [0.219963, 47.921994],
      [0.219834, 47.922216],
      [0.219641, 47.922339],
      [0.219308, 47.922382],
      [0.215778, 47.921469],
      [0.215617, 47.92144],
      [0.215521, 47.921505],
      [0.213901, 47.926164],
      [0.213622, 47.926667],
      [0.211229, 47.929916],
      [0.209877, 47.931347],
      [0.209255, 47.932066],
      [0.209008, 47.932411],
      [0.208987, 47.932648],
      [0.208976, 47.932885],
      [0.209105, 47.933151],
      [0.209266, 47.933374],
      [0.209502, 47.933568],
      [0.21035, 47.9342],
      [0.210682, 47.934481],
      [0.210854, 47.934768],
      [0.210886, 47.934977],
      [0.210811, 47.935595],
      [0.210714, 47.936184],
      [0.210543, 47.936486],
      [0.21036, 47.936644],
      [0.20977, 47.936989],
      [0.209298, 47.937349],
      [0.209073, 47.937694],
      [0.208966, 47.937974],
      [0.208976, 47.938247],
      [0.209126, 47.938549],
      [0.209266, 47.938801],
      [0.209491, 47.938995],
      [0.209985, 47.939261],
      [0.210307, 47.939527],
      [0.210489, 47.939757],
      [0.210553, 47.94003],
      [0.210521, 47.940296],
      [0.210414, 47.940684],
      [0.210221, 47.941992],
      [0.2102531047958209, 47.94229130126434],
      [0.210317, 47.942603],
      [0.21036, 47.942941],
      [0.210285, 47.943257],
      [0.2089658281576843, 47.94647699367268],
      [0.2088663926203742, 47.94673557923025],
      [0.2087471287506374, 47.94692775757817],
      [0.208526, 47.947051],
      [0.208354, 47.947094],
      [0.208204, 47.947202],
      [0.208129, 47.947274],
      [0.207936, 47.947957],
      [0.207877, 47.948115],
      [0.207769817899925, 47.94813324111409],
      [0.2076359091435793, 47.94816001184481],
      [0.20756, 47.94818],
      [0.207485, 47.948219],
      [0.207457181905975, 47.94834998818884],
      [0.2074749091436362, 47.94849398821442],
      [0.2074958475074185, 47.94883570910731],
      [0.2075134222525835, 47.94923600614268],
      [0.2075485717437092, 47.94986988401219],
    ],
  },
};

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

export default function Map() {
  const [mapPath, setMapPath] = useState<string | null>(null);
  const [time, setTime] = useState<number | null>(null);

  const [weatherMaps, setWeatherMaps] = useState<Map[] | null>(null);

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

        <Marker position={[47.956378, 0.208095]}>
          <Popup>Le Mans - Circuit de La Sarthe</Popup>
        </Marker>

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
      </MapContainer>

      {/* <JSONTree data={weatherMaps} /> */}
    </>
  );
}
