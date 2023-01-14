# Convert GeoJson to GPX

This package *NOT READY FOR USE*

Designed to be a browser library. Will interpret a geojson object into a gpx file.

```js
import GeoJsonToGpx from "geojson-to-gpx"

const geojson = { 
  type: "Feature",
  properties : {
    name : 'Valid GeoJson'
  },
  geometry: {
    type: "LineString",
    coordinates: [
      [102.0, 0.0],
      [103.0, 1.0],
      [104.0, 0.0],
      [105.0, 1.0]
    ]
  },
};

// Will convert geojson into xml document
const gpx = GeoJsonToGpx(geojson);

// convert document to string or post process it
const gpxString = new XMLSerializer().serializeToString(doc);

// @see https://stackoverflow.com/questions/10654971/create-text-file-from-string-using-js-and-html5
const link = document.createElement('a');
link.download = 'geojson-to-gpx.gpx';
const blob = new Blob([gpxString], {type: 'text/xml'});
link.href = window.URL.createObjectURL(blob);
link.click();

```
