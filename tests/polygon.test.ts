import { expect, test } from "vitest";

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

test('should have correct trk count', () => {
  const trk = gpx.querySelectorAll('trk');
  expect(trk).toHaveLength(0);
});

test('should have correct wpt count', () => {
  const wpts = gpx.querySelectorAll('wpt');
  expect(wpts).toHaveLength(0);
});