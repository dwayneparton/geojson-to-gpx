
import GeoJsonToGpx from "../src/index";
import { Feature, Polygon } from "geojson";

const geojson : Feature<Polygon> = { 
  type: "Feature",
  properties : {
    name : 'Test'
  },
  geometry: {
    type: "Polygon",
    coordinates: [[
      [102.0, 0.0],
      [103.0, 1.0],
      [104.0, 0.0],
      [105.0, 1.0],
      [102.0, 0.0]
    ]]
  },
};

const gpx = GeoJsonToGpx(geojson);

test('should not be null', () => {
  expect(gpx).not.toBeNull();
});