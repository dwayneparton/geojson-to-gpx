
import GeoJsonToGpx from "../src/index";
import { GeoJSON } from "geojson";

const options = {
  metadata: {
    name: 'A grand adventure',
    author: {
      name: 'Dwayne Parton'
    }
  }
}

const geojson : GeoJSON = { 
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


// uses js dom
test('converts geojson linestring to gpx', () => {
  const gpx = GeoJsonToGpx(geojson, options);
  expect(gpx).not.toBeNull();
});