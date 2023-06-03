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
  // This holds all the data that makes a GPX file
  const gpx = doc.createElement("gpx");
  gpx.setAttribute("version", version);
  gpx.setAttribute("creator", creator);
  gpx.setAttribute("xmlns", "http://www.topografix.com/GPX/1/1");

  /**
   * Creates a new tag with content and appends it to the parent
   */
  function createTagInParentElement(parent: Element, tagName : string, content: string | number | undefined){
    if(content === undefined){
      return;
    }
    const element = doc.createElement(tagName);
    const contentEl = doc.createTextNode(String(content));
    element.appendChild(contentEl);
    parent.appendChild(element);
  }
  
  /**
   * Creates a <trk> from GeoJsonProperties
   * Represents a track - an ordered list of points describing a path.
   */
  function createTrk(properties ?: GeoJsonProperties): Element{
    const el = doc.createElement('trk');
    if(properties){
      Object.keys(properties).forEach(key => {
        const value = properties[key];
        const supports = ['name', 'desc', 'link', 'src', 'type'];
        if(typeof value === 'string' && supports.includes(key)){
          createTagInParentElement(el, key, value);
        }
      });
    }
    return el;
  }
  
  /**
   * Creates a <trkseg /> from an array of points
   * Takes an position array and created a track segment
   * <trkseg> ...trkpts </trkseg>
   * A Track Segment holds a list of Track Points which are logically connected in order.
   * To represent a single GPS track where GPS reception was lost,
   * or the GPS receiver was turned off, 
   * start a new Track Segment for each continuous span of track data
   */
  function createTrkSeg(coordinates: Position[]): Element{
    const el = doc.createElement('trkseg');
    coordinates.forEach((point) => {
      el.appendChild(createPt("trkpt", point));
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
  function createPt(type: "wpt" | "trkpt", position: Position, properties ?: GeoJsonProperties): Element{
    const [lon, lat, ele, time] = position;
    const el = doc.createElement(type);
    el.setAttribute('lat', String(lat));
    el.setAttribute('lon', String(lon));
    createTagInParentElement(el, 'ele', ele);
    createTagInParentElement(el, 'time', time);
    if(properties){
      Object.keys(properties).forEach(key => {
        const value = properties[key];
        const supports = ['name', 'desc', 'link', 'src', 'type'];
        if(typeof value === 'string' && supports.includes(key)){
          createTagInParentElement(el, key, value);
        }
      });
    }
    return el;
  }
  
  /**
   * Interpret a GEOJson Feature 
   * We assume GEO JSON is related and interpret as such
   */
  function interpretFeature(gpx: Element, feature: Feature) : void{
    const {geometry, properties} = feature;
    const {type} = geometry;
    switch (type) {
      // Unsupported for now
      // Eventually could interpret into a line string
      case 'Polygon':
        return;
  
      // A Point in interpreted interpreted into
      // <wpt />
      case 'Point':
        gpx.appendChild(createPt("wpt", geometry.coordinates, properties));
        return;

      // MultiPoint is interpreted interpreted into multiple
      // <wpt /><wpt /><wpt />
      case 'MultiPoint':
        geometry.coordinates.forEach((coord: Position) => {
          gpx.appendChild(createPt("wpt", coord, properties));
        })
      return;

      // LineStrings are interpreted into
      // <trk><trkseg><trkpt /></trkseg></trk>
      case 'LineString':
        let lineTrk = createTrk(properties);
        const trkseg = createTrkSeg(geometry.coordinates);
        lineTrk.appendChild(trkseg);
        gpx.appendChild(lineTrk);
        return;

      // MultiLineStrings are interpreted into multiple trksegs
      // <trk><trkseg><trkpt /></trkseg><trkseg><trkpt /></trkseg></trk>
      case 'MultiLineString':
        const trk = createTrk(properties);
        geometry.coordinates.forEach((pos: Position[]) =>{
          const trkseg = createTrkSeg(pos);
          trk.appendChild(trkseg);
        })
        gpx.appendChild(trk);
        return;

      // All others are unsupported
      default:
        return;
    }
  }

  /**
   * Add Options Meta Data
   */
  if(options?.metadata){ 
    const meta = options.metadata;
    const metadata = doc.createElement("metadata");
    createTagInParentElement(metadata, 'name', meta?.name);
    createTagInParentElement(metadata, 'desc', meta?.desc);
    if(meta?.author){
      const author = doc.createElement("author");
      createTagInParentElement(author, 'name', meta?.author?.name);
      createTagInParentElement(author, 'email', meta?.author?.email);
      createTagInParentElement(author, 'link', meta?.author?.link);
      metadata.appendChild(author);
    }
    if(meta?.copyright){
      const copyright = doc.createElement("copyright");
      if(meta?.copyright?.author){
        copyright.setAttribute('author', meta?.copyright?.author);
      }
      createTagInParentElement(copyright, 'year', meta?.copyright?.license);
      createTagInParentElement(copyright, 'license', meta?.copyright?.year);
      metadata.appendChild(copyright);
    }
    createTagInParentElement(metadata, 'time', meta?.time);
    createTagInParentElement(metadata, 'keywords', meta?.keywords);
    gpx.appendChild(metadata);
  }

  // Process GeoJSON
  const{type} = geoJson;
  switch (type) {

    case 'Feature':
      interpretFeature(gpx, geoJson);
      break;

    case 'FeatureCollection':
      const {features} = geoJson;
      features.forEach((feature: Feature) => {
        interpretFeature(gpx, feature);
      });
      break;
  
    default:
      break;
  }

  // Append GPX to DOC
  doc.appendChild(gpx);
  return doc;
}
