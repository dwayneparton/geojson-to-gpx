import { expect, test } from "vitest";

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

test('test should serialize to valid XML', () => {
  const gpxString = new XMLSerializer().serializeToString(gpx);
  const domParser = new DOMParser();
  const dom = domParser.parseFromString(gpxString, 'text/xml');
  expect(dom.documentElement.nodeName).toBe('gpx');
  const root = dom.querySelector('gpx');
  expect(root?.getAttribute('xmlns')).toEqual('http://www.topografix.com/GPX/1/1');
});