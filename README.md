# Convert GeoJson to GPX

[![codecov](https://codecov.io/gh/dwayneparton/geojson-to-gpx/branch/master/graph/badge.svg?token=6M670T9Z3Z)](https://codecov.io/gh/dwayneparton/geojson-to-gpx)

Designed to be a browser library. Will interpret a geojson object into a gpx XMLDocument. From there you can convert it to a string for download or post process the document.

Can be used with Node though by doing something like:

```js
  import { DOMImplementation } from '@xmldom/xmldom';
  import GeoJsonToGpx from "@dwayneparton/geojson-to-gpx"
  global.document = {implementation: new DOMImplementation()};
  const gpx = GeoJsonToGpx(geojson, options);
```

## Contributions

Contributions welcome.

### Goals and Parameters

* 0 dependency
* Lightweight
* i/o - GeoJson -> XMLDocument
* Schema - https://www.topografix.com/GPX/1/1/

## Installation

```sh
npm install @dwayneparton/geojson-to-gpx
```

## Supports

### GeoJson

* Feature
* FeatureCollection - each feature(LineSting|MultiLineString) is interpreted into it's own trk, (Point|MultiPoint) will be new wpt

### Geometries

* Point
* MultiPoint - adds wpt for each point
* LineString
* MultiLineString - each link string is broken out into a net trkseg

Incompatible Geometries are ignored. Why? The GPX format is designed for storing waypoints, tracks, and routes.

## Example

This examples converts a geojson object to a gpx file for users to download.

```js
import GeoJsonToGpx from "@dwayneparton/geojson-to-gpx"

const options = {
  metadata: {
    name: 'A grand adventure',
    author: {
      name: 'Dwayne Parton',
      link: {
        href: 'https://www.dwayneparton.com'
      }
    }
  }
}

const geojson = { 
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

// Will convert geojson into xml document
const gpx = GeoJsonToGpx(geojson, options);

// convert document to string or post process it
const gpxString = new XMLSerializer().serializeToString(gpx);

// @see https://stackoverflow.com/questions/10654971/create-text-file-from-string-using-js-and-html5
const link = document.createElement('a');
link.download = 'geojson-to-gpx.gpx';
const blob = new Blob([gpxString], {type: 'text/xml'});
link.href = window.URL.createObjectURL(blob);
link.click();

```
