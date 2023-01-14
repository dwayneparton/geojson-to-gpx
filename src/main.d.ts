interface Bounds {
  minlat: string,
  minlon: string,
  maxlat: string,
  maxlon: string
}

interface Copyright {
  author?: string,
  year?: string,
  license?: string
}

interface Link {
  href?: string,
  text?: string,
  type?: string
}

interface Person {
  name?: string,
  email?: string,
  link?: LinkType
}

interface MetaData {
  name?: string,
  desc?: string,
  author?: Person,
  copyright?: Copyright,
  link?: Link,
  time?: string,
  keywords?: string,
  bounds?: Bounds,
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