
import GeoJsonToGpx from "../src/index";
import { Feature, LineString } from "geojson";

const options: Options = {
  creator: 'Dwayne Parton',
  version: '1.0.0',
  metadata: {
    name: 'A grand adventure',
    author: {
      name: 'Dwayne Parton'
    }
  }
}

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
  expect(gpxEl?.getAttribute('xmlns')).toEqual('http://www.topografix.com/GPX/1/1')
});

test('should have correct creator attribute', () => {
  expect(gpxEl?.getAttribute('creator')).toEqual(options.creator)
});

test('should have correct version attribute', () => {
  expect(gpxEl?.getAttribute('version')).toEqual(options.version)
});

test('should have metadata', () => {
  expect(metadataEl).not.toBeNull();
});

test('should have metadata name', () => {
  const name = metadataEl?.querySelector('name')
  expect(name).not.toBeNull();
  expect(name?.innerHTML).toEqual(options.metadata?.name);
});

test('should have metadata author', () => {
  const author = metadataEl?.querySelector('author')
  expect(author).not.toBeNull();
});
