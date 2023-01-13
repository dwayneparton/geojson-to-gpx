import { GeoJSON } from "geojson";

interface MetaData {

}

interface Options {
	creator ?: string,
	metadata ?: MetaData,
	name ?: string,
	desc ?: string,
	link ?: string,
}

export default function geojsonToGpx(geoJson: GeoJSON, options ?: Options){

	const name = options?.name;

	// if(geoJson.type === 'FeatureCollection'){}
	// if(geoJson.type === 'Feature'){}

	const base = '<gpx></gpx>';
	const parser = new DOMParser();
	const gpx = parser.parseFromString(base, 'text/xml');
	if(name){
		const attribute = gpx.createElement('name');
		attribute.innerText = name;
		gpx.appendChild(attribute);
	}
	const desc = gpx.createElement('desc');
	const type = gpx.createElement('type');
	const cmt = gpx.createElement('cmt');
	const sym = gpx.createElement('sym');
	const time = gpx.createElement('time');
	const track = gpx.createElement('trk');
	const trkseg = gpx.createElement('trkseg');
	const trkpt = gpx.createElement('trkpt');


	console.log(gpx);
}

const test : GeoJSON = { 
		type: "Feature",
		properties : {
			name : 'Test'
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

geojsonToGpx(test, {name: 'This is the name'});