
import GeoJsonToGpx from "../src/index";
import geojson from "./mocks/feature-collection";

const options = {
  metadata: {
    name: 'A grand adventure',
    author: {
      name: 'Dwayne Parton'
    }
  }
}

// uses js dom
test('converts geojson feature collection to gpx', () => {
  const gpx = GeoJsonToGpx(geojson, options);
  expect(gpx).not.toBeNull();
});