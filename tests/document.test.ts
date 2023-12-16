import { expect, test } from "vitest";

import GeoJsonToGpx from "../src/index";
import geojson from "./mocks/feature-collection";

const gpx = GeoJsonToGpx(geojson);


test('test should serialize to valid XML', () => {
  const gpxString = new XMLSerializer().serializeToString(gpx);
  const domParser = new DOMParser();
  const dom = domParser.parseFromString(gpxString, 'text/xml');
  expect(dom.documentElement.nodeName).toBe('gpx');
  const root = dom.querySelector('gpx');
  expect(root?.getAttribute('xmlns')).toEqual('http://www.topografix.com/GPX/1/1');
});