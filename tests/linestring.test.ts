import { expect, test } from "vitest";

import GeoJsonToGpx from "../src/index";
import { Feature, LineString } from "geojson";

const geojson: Feature<LineString> = { 
  type: "Feature",
  properties : {
    desc : 'This is a description',
    src : 'Test',
    type : 'Race',
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

test('should have correct trk properties and be in correct order', () => {
  const trk = gpx.querySelector('trk');
  const name = trk?.querySelector('name');
  expect(name?.innerHTML).toBe(geojson?.properties?.name);
  // desc should be after name
  const desc = trk?.querySelector('desc');
  expect(name?.nextSibling).toBe(desc);
  expect(desc?.innerHTML).toBe(geojson?.properties?.desc);
  // src should be after desc
  const src = trk?.querySelector('src');
  expect(desc?.nextSibling).toBe(src);
  expect(src?.innerHTML).toBe(geojson?.properties?.src);
  // Type should be after src
  const type = trk?.querySelector('type');
  expect(src?.nextSibling).toBe(type);
  expect(type?.innerHTML).toBe(geojson?.properties?.type);
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
  });
});