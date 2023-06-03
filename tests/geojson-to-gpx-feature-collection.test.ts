
import GeoJsonToGpx from "../src/index";
import geojson from "./mocks/feature-collection";

test('converts geojson feature collection to gpx', () => {
  const gpx = GeoJsonToGpx(geojson);
  expect(gpx).not.toBeNull();
});