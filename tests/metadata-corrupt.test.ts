import { expect, test } from "vitest";

import GeoJsonToGpx from "../src/index";
import { Feature, LineString } from "geojson";

const options = {
  creator: 'Dwayne Parton',
  version: 100,
  metadata: {
    name: 'A grand adventure',
    link: 'https://www.dwaynepaton.com',
    author: {
      name: 'Dwayne Parton',
      link: {
        text: 'Website',
        type: 'Web Page',
      }
    },
    copyright: {},
    time: 1,
    keywords: 'this,is,a,test'
  }
};

const geojson: Feature<LineString> = { 
  type: "Feature",
  properties : {
    name : 'Slow journey from null island'
  },
  geometry: {
    type: "LineString",
    coordinates: [
      [0.0, 0.0],
      [0.0, 1.0],
      [0.0, 2.0],
      [0.0, 3.0]
    ]
  },
};

// @ts-expect-error - testing corruption
const gpx = GeoJsonToGpx(geojson, options);
const metadataEl = gpx.querySelector('metadata');

test('cover author when not object', () => {
  const opts = {
    metadata: {
      author: 'Not an object',
    }
  };
  // @ts-expect-error - testing corruption
  const gpx = GeoJsonToGpx(geojson, opts);
  const metadataEl = gpx.querySelector('metadata');
  const author = metadataEl?.querySelector('author');
  expect(author).toBe(null);
});

test('cover link when not object', () => {
  const opts = {
    metadata: {
      author: {
        link: 'test'
      },
    }
  };
  // @ts-expect-error - testing corruption
  const gpx = GeoJsonToGpx(geojson, opts);
  const metadataEl = gpx.querySelector('metadata');
  const link = metadataEl?.querySelector('link');
  expect(link).toBe(null);
});

test('should not have metadata link when corrupt', () => {
  const link = metadataEl?.querySelector('link');
  expect(link).toBe(null);
});

test('should not have metadata author.link when corrupt', () => {
  const author = metadataEl?.querySelector('author');
  const link = author?.querySelector('link');
  expect(link).toBe(null);
});

test('should still have correct trkpt count', () => {
  const trkpt = gpx.querySelectorAll('trkpt');
  expect(trkpt).toHaveLength(geojson.geometry.coordinates.length);
  const firstTrkpt = trkpt.item(0);
  expect(firstTrkpt.getAttribute('lon')).toEqual(String(geojson.geometry.coordinates[0][0]));
  expect(firstTrkpt.getAttribute('lat')).toEqual(String(geojson.geometry.coordinates[0][1]));
});