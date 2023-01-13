"use strict";
exports.__esModule = true;
function geojsonToGpx(geoJson, options) {
    var gpx = document.implementation.createDocument("", "", null);
    var desc = gpx.createElement('desc');
    gpx.appendChild(desc);
    var type = gpx.createElement('type');
    var cmt = gpx.createElement('cmt');
    var sym = gpx.createElement('sym');
    var time = gpx.createElement('time');
    var name = gpx.createElement('name');
    var track = gpx.createElement('trk');
    var trkseg = gpx.createElement('trkseg');
    var trkpt = gpx.createElement('trkpt');
    console.log('test');
}
exports["default"] = geojsonToGpx;
console.log('test');
var test = {
    type: "Feature",
    properties: {
        name: 'Test'
    },
    geometry: {
        type: "LineString",
        coordinates: [
            [102.0, 0.0],
            [103.0, 1.0],
            [104.0, 0.0],
            [105.0, 1.0]
        ]
    }
};
geojsonToGpx(test);
