
import GeoJsonToGpx from "../src/index";
import geojson from "./mocks/feature-collection";

const gpx = GeoJsonToGpx(geojson);

test('converts geojson feature collection to gpx', () => {
  expect(gpx).not.toBeNull();
});

test('should have correct order of elements', () => {
  const trk = gpx.querySelectorAll('trk');
  const first = trk[0];
  const wpt = first.previousSibling;
  expect(wpt?.nodeName).toBe('wpt');
  const last = trk[trk.length- 1];
  expect(last.nextSibling).toBe(null);
});