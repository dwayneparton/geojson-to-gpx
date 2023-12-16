/**
 * @jest-environment node
 */
import { expect, test, beforeAll } from "vitest";

import { DOMImplementation, XMLSerializer, DOMParser } from '@xmldom/xmldom';
import geojson from "./mocks/feature-collection";
import GeoJsonToGpx from "../src/index";

beforeAll(() => {
  // @ts-ignore only for node
  global.document = {implementation: new DOMImplementation()};
});

test('test should serialize to valid XML', () => {
  const gpx = GeoJsonToGpx(geojson);
  const gpxString = new XMLSerializer().serializeToString(gpx);
  const domParser = new DOMParser();
  const dom = domParser.parseFromString(gpxString, 'text/xml');
  expect(dom.documentElement.nodeName).toBe('gpx');
  expect(dom.documentElement.getAttribute('xmlns')).toEqual('http://www.topografix.com/GPX/1/1');
});