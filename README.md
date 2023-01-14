# Convert GeoJson to GPX

This package in in the concept phase and is *NOT READY FOR USE*

Designed to be a browser library. Will interpret a geojson object into a XMLDocument.

## Installation

```sh
npm install @dwayneparton/geojson-to-gpx
```

## Example

```js
import GeoJsonToGpx from "@dwayneparton/geojson-to-gpx"

const options = {
  metadata: {
    name: 'A grand adventure',
    author: {
      name: 'Dwayne Parton'
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
