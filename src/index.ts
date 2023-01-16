import { Feature, FeatureCollection, GeoJsonProperties, Position } from "geojson";

export default function GeoJsonToGpx(geoJson: Feature | FeatureCollection, options ?: Options): XMLDocument
{
  const doc = document.implementation.createDocument("http://www.topografix.com/GPX/1/1", "");
  const instruct = doc.createProcessingInstruction('xml', 'version="1.0" encoding="UTF-8"');
  doc.append(instruct);
  const packageVersion = '0.0.10';
  const packageName = "@dwayneparton/geojson-to-gpx";
  const version = options?.version || packageVersion;
  const creator = options?.creator || packageName;

  const gpx = doc.createElement("gpx");
  gpx.setAttribute("version", version);
  gpx.setAttribute("creator", creator);
  gpx.setAttribute("xmlns", "http://www.topografix.com/GPX/1/1");

  function addElement(el: Element, tagName : string,  content: string | undefined){
    if(content === undefined){
      return;
    }
    const element = doc.createElement(tagName);
    const contentEl = doc.createTextNode(content);
    element.appendChild(contentEl);
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
    wpt.setAttribute('lat', String(lat));
    wpt.setAttribute('lon', String(lon));
    addElement(wpt, 'ele', String(ele));
    addElement(wpt, 'time', String(time));
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

  if(options?.metadata){ 
    const meta = options.metadata;
    const metadata = doc.createElement("metadata");
    addElement(metadata, 'name', meta?.name);
    addElement(metadata, 'desc', meta?.desc);
    if(meta?.author){
      const author = doc.createElement("author");
      addElement(author, 'name', meta?.author?.name);
      addElement(author, 'email', meta?.author?.email);
      addElement(author, 'link', meta?.author?.link);
      metadata.appendChild(author);
    }
    if(meta?.copyright){
      const copyright = doc.createElement("copyright");
      if(meta?.copyright?.author){
        copyright.setAttribute('author', meta?.copyright?.author);
      }
      addElement(copyright, 'year', meta?.copyright?.license);
      addElement(copyright, 'license', meta?.copyright?.year);
      metadata.appendChild(copyright);
    }
    addElement(metadata, 'time', meta?.time);
    addElement(metadata, 'keywords', meta?.keywords);
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
  return doc;
}
