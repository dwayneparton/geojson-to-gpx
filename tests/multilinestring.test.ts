import { expect, test } from "vitest";

import GeoJsonToGpx from "../src/index";
import { Feature, MultiLineString } from "geojson";

const geojson : Feature<MultiLineString> = { 
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

const gpx = GeoJsonToGpx(geojson);

test('should not be null', () => {
  expect(gpx).not.toBeNull();
});

test('should have correct trk count', () => {
  const trk = gpx.querySelectorAll('trk');
  expect(trk).toHaveLength(1);
});

test('should have correct trkseg count', () => {
  const trkseg = gpx.querySelectorAll('trkseg');
  expect(trkseg).toHaveLength(geojson.geometry.coordinates.length);
});

test('should have correct trkpt count', () => {
  const trkpt = gpx.querySelectorAll('trkpt');
  const length = geojson.geometry.coordinates.reduce((prev, curr) => prev + curr.length, 0);
  expect(trkpt).toHaveLength(length);
});