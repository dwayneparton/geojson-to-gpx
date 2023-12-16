import { expect, test } from "vitest";

import GeoJsonToGpx from "../src/index";
import { Feature, GeometryCollection } from "geojson";

const geojson : Feature<GeometryCollection> = { 
  type: "Feature",
  properties : {
    name : 'Test'
  },
  geometry: {
    type: "GeometryCollection",
    geometries: []
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
  expect(wpts).toHaveLength(0);
});