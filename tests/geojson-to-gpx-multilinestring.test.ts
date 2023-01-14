
import GeoJsonToGpx from "../src/index";
import { GeoJSON } from "geojson";

const sampleGeoJsonLine : GeoJSON = { 
  type: "Feature",
  properties : {
    name : 'Test'
  },
  geometry: {
    type: "MultiLineString",
    coordinates: [[
      [102.0, 0.0],
      [103.0, 1.0],
      [104.0, 0.0],
      [105.0, 1.0]
    ],[
      [102.0, 0.0],
      [103.0, 1.0],
      [104.0, 0.0],
      [105.0, 1.0]
    ]]
  },
};

// uses js dom
test('converts geojson linestring to gpx', () => {
  const gpx = GeoJsonToGpx(sampleGeoJsonLine, {creator: 'Dwayne Parton', metadata: {name: 'Test'}});
  expect(gpx).not.toBeNull();
});