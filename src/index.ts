import { Feature, FeatureCollection, GeoJsonProperties, Position } from "geojson";

/**
 * Interpreting GeoJSON into GPX is lossy
 * It can not be interpreted back into the exact same GeoJSON
 * However, it is still a useful format for many people
 * and is popular with trail runners, race coordinators, and more
 * @param geoJson Feature | FeatureCollection
 * @param options Options
 * @returns XMLDocument
 */
export default function GeoJsonToGpx(geoJson: Feature | FeatureCollection, options ?: Options): XMLDocument
{
  // Create root XMLDocument
  const doc = document.implementation.createDocument("http://www.topografix.com/GPX/1/1", "");
  const instruct = doc.createProcessingInstruction('xml', 'version="1.0" encoding="UTF-8"');
  doc.append(instruct);

  // Set up default options
  const defaultPackageVersion = '0.0.15';
  const defaultPackageName = "@dwayneparton/geojson-to-gpx";
  const version = options?.version || defaultPackageVersion;
  const creator = options?.creator || defaultPackageName;

  // Set up base GPX Element
  const gpx = doc.createElement("gpx");
  gpx.setAttribute("version", version);
  gpx.setAttribute("creator", creator);
  gpx.setAttribute("xmlns", "http://www.topografix.com/GPX/1/1");

  /**
   * Creates an element with content and appends it to the parent
   */
  function addElement(el: Element, tagName : string,  content: string | number | undefined){
    if(content === undefined){
      return;
    }
    const element = doc.createElement(tagName);
    const contentEl = doc.createTextNode(String(content));
    element.appendChild(contentEl);
    el.appendChild(element);
  }
  
  /**
   * Represents a track - an ordered list of points describing a path.
   */
  function addTrk(properties ?: GeoJsonProperties): Element{
    const el = doc.createElement('trk');
    if(properties){
      Object.keys(properties).forEach(key => {
        const value = properties[key];
        const supports = ['name', 'desc', 'link', 'src', 'type'];
        if(typeof value === 'string' && supports.includes(key)){
          addElement(el, key, value);
        }
      });
    }
    return el;
  }
  
  /**
   * Takes an position array and created a track segment
   * <trkseg> ...trkpts </trkseg>
   * A Track Segment holds a list of Track Points which are logically connected in order.
   * To represent a single GPS track where GPS reception was lost,
   * or the GPS receiver was turned off, 
   * start a new Track Segment for each continuous span of track data
   */
  function addTrkSeg(coordinates: Position[]): Element{
    const el = doc.createElement('trkseg');
    coordinates.forEach((point) => {
      el.appendChild(addPt("trkpt", point));
    })
    return el;
  }
  
  /**
   * Creates:
   * <wpt|trkpt lat="" lon="">
   *     <ele>{ele}</ele>
   *     <time>{time}</time>
   * </wpt|trkpt>
   * These are compatible elements
   */
  function addPt(type: "wpt" | "trkpt", position: Position, properties ?: GeoJsonProperties): Element{
    const [lon, lat, ele, time] = position;
    const el = doc.createElement(type);
    el.setAttribute('lat', String(lat));
    el.setAttribute('lon', String(lon));
    addElement(el, 'ele', ele);
    addElement(el, 'time', time);
    if(properties){
      Object.keys(properties).forEach(key => {
        const value = properties[key];
        const supports = ['name', 'desc', 'link', 'src', 'type'];
        if(typeof value === 'string' && supports.includes(key)){
          addElement(el, key, value);
        }
      });
    }
    return el;
  }
  
  /**
   * Process a GEOJson Feature 
   * We assume GEO JSON is related and interpret as such
   */
  function addFeature(gpx: Element, feature: Feature) : void{
    const {geometry, properties} = feature;
    const {type} = geometry;
  
    // Unsupported
    if(type === 'GeometryCollection'){
      return;
    }

    // Unsupported
    if(type === 'Polygon'){
      return;
    }
  
    // A Point in interpreted interpreted into
    // <wpt />
    if(type === 'Point'){
      const {coordinates} = geometry;
      gpx.appendChild(addPt("wpt", coordinates, properties));
    }
  
    // MultiPoint is interpreted interpreted into multiple
    // <wpt /><wpt /><wpt />
    if(type === 'MultiPoint'){
      const {coordinates} = geometry;
      coordinates.forEach((coord: Position) => {
        gpx.appendChild(addPt("wpt", coord, properties));
      })
    }
  
    // LineStrings are interpreted into
    // <trk><trkseg><trkpt /></trkseg></trk>
    if(type === 'LineString'){
      const {coordinates} = geometry;
      const trk = addTrk(properties);
      if(type === 'LineString'){
        const trkseg = addTrkSeg(coordinates);
        trk.appendChild(trkseg);
      }
      gpx.appendChild(trk);
    }
  
    // MultiLineStrings are interpreted into multiple trksegs
    // <trk><trkseg><trkpt /></trkseg><trkseg><trkpt /></trkseg></trk>
    if(type === 'MultiLineString'){
      const {coordinates} = geometry;
      const trk = addTrk(properties);
      if(type === 'MultiLineString'){
        coordinates.forEach((pos: Position[]) =>{
          const trkseg = addTrkSeg(pos);
          trk.appendChild(trkseg);
        })
      }
      gpx.appendChild(trk);
    }
  }

  /**
   * Add Options Meta Data
   */
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

  // Process GeoJSON
  const{type} = geoJson;
  if(type === 'Feature'){
    addFeature(gpx, geoJson);
  }
  if(type === 'FeatureCollection'){
    const {features} = geoJson;
    features.forEach((feature: Feature) => {
      addFeature(gpx, feature);
    });
  }

  // Append GPX to DOC
  doc.appendChild(gpx);
  return doc;
}
