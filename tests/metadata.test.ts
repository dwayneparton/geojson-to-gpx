import { expect, test } from "vitest";

import GeoJsonToGpx, {Options} from "../src/index";
import { Feature, LineString } from "geojson";

const options: Options = {
  creator: 'Dwayne Parton',
  version: '1.0.0',
  metadata: {
    name: 'A grand adventure',
    link: {
      href: 'https://www.dwaynepaton.com',
    },
    author: {
      name: 'Dwayne Parton',
      link: {
        href: 'https://www.dwayneparton.com',
        text: 'Website',
        type: 'Web Page',
      }
    },
    copyright: {
      author: 'Dwayne Parton',
      year: '2023',
      license: 'MIT'
    },
    time: '0',
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

const gpx = GeoJsonToGpx(geojson, options);
const gpxEl = gpx.querySelector('gpx');
const metadataEl = gpx.querySelector('metadata');

test('should have correct xmlns attribute', () => {
  expect(gpx.lookupNamespaceURI('')).toEqual('http://www.topografix.com/GPX/1/1');
});

test('should have correct creator attribute', () => {
  expect(gpxEl?.getAttribute('creator')).toEqual(options.creator);
});

test('should have correct version attribute', () => {
  expect(gpxEl?.getAttribute('version')).toEqual('1.1');
});

test('should have metadata', () => {
  expect(metadataEl).not.toBeNull();
});

test('should have metadata name', () => {
  const name = metadataEl?.querySelector('name');
  expect(name).not.toBeNull();
  expect(name?.innerHTML).toEqual(options.metadata?.name);
});

test('should have metadata author', () => {
  const author = metadataEl?.querySelector('author');
  expect(author).not.toBeNull();
});

test('should have metadata author.name', () => {
  const author = metadataEl?.querySelector('author');
  const name = author?.querySelector('name');
  expect(name?.innerHTML).toEqual(options.metadata?.author?.name);
});


test('should have metadata author.link', () => {
  const author = metadataEl?.querySelector('author');
  const link = author?.querySelector('link');
  expect(link?.getAttribute('href')).toEqual(options.metadata?.author?.link?.href);
});


test('should have metadata copyright', () => {
  const copyright = metadataEl?.querySelector('copyright');
  expect(copyright).not.toBeNull();
  expect(copyright?.getAttribute('author')).toEqual(options.metadata?.copyright?.author);
});

test('should have metadata copyright.license', () => {
  const copyright = metadataEl?.querySelector('copyright');
  const license = copyright?.querySelector('license');
  expect(license).not.toBeNull();
  expect(license?.innerHTML).toEqual(options.metadata?.copyright?.license);
});

test('should have metadata copyright.year', () => {
  const copyright = metadataEl?.querySelector('copyright');
  const year = copyright?.querySelector('year');
  expect(year).not.toBeNull();
  expect(year?.innerHTML).toEqual(options.metadata?.copyright?.year);
});

test('should have metadata time', () => {
  const time = metadataEl?.querySelector('time');
  expect(time).not.toBeNull();
  expect(time?.innerHTML).toEqual(options.metadata?.time);
});

test('should have metadata keywords', () => {
  const keywords = metadataEl?.querySelector('keywords');
  expect(keywords).not.toBeNull();
  expect(keywords?.innerHTML).toEqual(options.metadata?.keywords);
});

