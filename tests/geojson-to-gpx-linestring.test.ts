
import GeoJsonToGpx from "../src/index";
import { GeoJSON } from "geojson";

const sampleGeoJsonLine : GeoJSON = { 
  type: "Feature",
  properties : {
    name : 'Test'
  },
  geometry: {
    type: "LineString",
    coordinates: [
      [102.0, 0.0],
      [103.0, 1.0],
      [104.0, 0.0],
      [105.0, 1.0]
    ]
  },
};

// uses js dom
test('converts geojson linestring to gpx', () => {
  const gpx = geojsonToGpx(sampleGeoJsonLine, {creator: 'Dwayne Parton', metadata: {name: 'Here is some meta data'}});
  expect(gpx).not.toBeNull();
});