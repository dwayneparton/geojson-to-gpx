
import GeoJsonToGpx from "../src/index";
import { Feature, MultiPoint } from "geojson";

const geojson: Feature<MultiPoint> = { 
  type: "Feature",
  properties : {
    name : 'Slow journey from null island'
  },
  geometry: {
    type: "MultiPoint",
    coordinates: [
      [0.0, 1.0],
      [0.0, 2.0],
      [0.0, 3.0],
      [0.0, 4.0]
    ]
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
  const wpts = gpx.querySelectorAll('wpt');
  expect(wpts).toHaveLength(geojson.geometry.coordinates.length);
});

test('should have correct lat lons', () => {
  const wpts = gpx.querySelectorAll('wpt');
  wpts.forEach((wpt, key) => {
    expect(wpt.getAttribute('lon')).toEqual(String(geojson.geometry.coordinates[key][0]));
    expect(wpt.getAttribute('lat')).toEqual(String(geojson.geometry.coordinates[key][1]));
  });
});