import { Feature, FeatureCollection, GeoJsonProperties, Position } from "geojson";

interface MetaData {
	[name: string]: string
}

interface Options {
	creator ?: string,
	version ?: string,
	metadata ?: MetaData,
}

interface KeyValue {
	key : string,
	value : string,
}

export default function geojsonToGpx(geoJson: Feature | FeatureCollection, options ?: Options): string
{
	const doc = document.implementation.createDocument("", "");
	const version = options?.version || "0.1";
	const creator = options?.creator || "Dwayne Parton";
	const meta = options?.metadata || {};

	function addElement(el: Element, tagName : string,  content ?: string, properties?: KeyValue[]){
		const element = doc.createElement(tagName);
		if(content){
			const contentEl = doc.createTextNode(content);
			element.appendChild(contentEl);
		}
		if(properties){
			properties.forEach(prop => {
				element.setAttribute(prop.key, prop.value)
			});
		}
		el.appendChild(element);
	}
	
	function addTrk(properties ?: GeoJsonProperties): Element{
		const wpt = doc.createElement('trk');
		if(properties){
			Object.keys(properties).forEach(key => {
				const value = properties[key];
				const supports = ['name', 'desc', 'link', 'src', 'type'];
				if(typeof value === 'string' && supports.includes(key)){
					addElement(wpt, key, value);
				}
			});
		}
		return wpt;
	}
	
	function addTrkSeg(coordinates: Position[]): Element{
		const trkseg = doc.createElement('trkseg');
		coordinates.forEach((point) => {
			trkseg.appendChild(addPt("trkpt", point));
		})
		return trkseg;
	}
	
	function addPt(type: "wpt" | "trkpt", position: Position, properties ?: GeoJsonProperties): Element{
		const [lon, lat, ele, time] = position;
		const wpt = doc.createElement(type);
		wpt.setAttribute("lat", `${lat}`);
		wpt.setAttribute("lon", `${lon}`);
		if(ele){
			addElement(wpt, 'ele', `${ele}`);
		}
		if(time){
			addElement(wpt, 'time', `${time}`);
		}
		if(properties){
			Object.keys(properties).forEach(key => {
				const value = properties[key];
				const supports = ['name', 'desc', 'link', 'src', 'type'];
				if(typeof value === 'string' && supports.includes(key)){
					addElement(wpt, key, value);
				}
			});
		}
		return wpt;
	}
	
	function addFeature(gpx: Element, feature: GeoJSON.Feature) : void{
		const {geometry, properties} = feature;
		const {type} = geometry;
	
		if(type === 'GeometryCollection'){
			return;
		}
	
		if(type === 'Point'){
			const {coordinates} = geometry;
			gpx.appendChild(addPt("wpt", coordinates, properties));
		}
	
		if(type === 'MultiPoint'){
			const {coordinates} = geometry;
			coordinates.forEach((coord) => {
				gpx.appendChild(addPt("wpt", coord, properties));
			})
		}
	
		if(type === 'LineString'){
			const {coordinates} = geometry;
			const trk = addTrk(properties);
			if(type === 'LineString'){
				const trkseg = addTrkSeg(coordinates);
				trk.appendChild(trkseg);
			}
			gpx.appendChild(trk);
		}
	
		if(type === 'MultiLineString'){
			const {coordinates} = geometry;
			const trk = addTrk(properties);
			if(type === 'MultiLineString'){
				coordinates.forEach((pos) =>{
					const trkseg = addTrkSeg(pos);
					trk.appendChild(trkseg);
				})
			}
			gpx.appendChild(trk);
		}
	}
	
	// Start building
	const gpx = doc.createElementNS("http://www.topografix.com/GPX/1/1", "gpx");
	gpx.setAttribute("version", version);
	gpx.setAttribute("creator", creator);

	if(meta){ 
		const metadata = doc.createElement("metadata");
		Object.keys(meta).forEach((key: string) => {
			addElement(metadata, key, meta[key], []);
		})
		gpx.appendChild(metadata);
	}

	const{type} = geoJson;
	if(type === 'Feature'){
		addFeature(gpx, geoJson);
	}
	if(type === 'FeatureCollection'){
		const {features} = geoJson;
		features.forEach(feature => {
			addFeature(gpx, feature);
		});
	}
	doc.appendChild(gpx);
	return new XMLSerializer().serializeToString(doc);
}
