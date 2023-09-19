
import GeoJsonToGpx from "../src/index";
import { Feature, Point } from "geojson";

const geojson : Feature<Point> = { 
  type: "Feature",
  properties : {
    name : 'Test'
  },
  geometry: {
    type: "Point",
    coordinates: [102.0, 0.0]
  },
};
const gpx = GeoJsonToGpx(geojson);

test('should not be null', () => {
  expect(gpx).not.toBeNull();
});

test('should have correct trk count', () => {
  const trk = gpx.querySelectorAll('trk');
  expect(trk).toHaveLength(0);
});

test('should have correct wpt count', () => {
  const wpt = gpx.querySelectorAll('wpt');
  expect(wpt).toHaveLength(1);
});

test('should have correct wpt lat lon', () => {
  const wpt = gpx.querySelector('wpt');
  expect(wpt?.getAttribute('lon')).toEqual(String(geojson.geometry.coordinates[0]));
  expect(wpt?.getAttribute('lat')).toEqual(String(geojson.geometry.coordinates[1]));
});