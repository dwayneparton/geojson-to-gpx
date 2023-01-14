
import geojsonToGpx from "../src/index";
import { GeoJSON } from "geojson";

const sampleGeoJsonLine : GeoJSON = { 
  type: "Feature",
  properties : {
    name : 'Test'
  },
  geometry: {
    type: "Point",
    coordinates: [102.0, 0.0]
  },
};

// uses js dom
test('converts geojson linestring to gpx', () => {
  const gpx = geojsonToGpx(sampleGeoJsonLine, {creator: 'Dwayne Parton', metadata: {name: 'Test'}});
  expect(gpx).not.toBeNull();
});