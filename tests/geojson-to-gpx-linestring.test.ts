
import GeoJsonToGpx from "../src/index";
import { Feature, LineString } from "geojson";

const geojson: Feature<LineString> = { 
  type: "Feature",
  properties : {
    name : 'Slow journey from null island'
  },
  geometry: {
    type: "LineString",
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
  expect(trk).toHaveLength(1);
});

test('should have correct trkpt count', () => {
  const trkpt = gpx.querySelectorAll('trkpt');
  expect(trkpt).toHaveLength(geojson.geometry.coordinates.length);
  const firstTrkpt = trkpt.item(0);
  expect(firstTrkpt.getAttribute('lon')).toEqual(String(geojson.geometry.coordinates[0][0]));
  expect(firstTrkpt.getAttribute('lat')).toEqual(String(geojson.geometry.coordinates[0][1]));
});

test('should have correct lat lons', () => {
  const trkpts = gpx.querySelectorAll('trkpt');
  trkpts.forEach((trkpt, key) => {
    expect(trkpt.getAttribute('lon')).toEqual(String(geojson.geometry.coordinates[key][0]));
    expect(trkpt.getAttribute('lat')).toEqual(String(geojson.geometry.coordinates[key][1]));
  })
});