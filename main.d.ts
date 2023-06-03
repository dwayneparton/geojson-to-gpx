declare interface Bounds {
  minlat: string,
  minlon: string,
  maxlat: string,
  maxlon: string
}

declare interface Copyright {
  author?: string,
  year?: string,
  license?: string
}

declare interface Link {
  href?: string,
  text?: string,
  type?: string
}

declare interface Person {
  name?: string,
  email?: string,
  link?: LinkType
}

declare interface MetaData {
  name?: string,
  desc?: string,
  author?: Person,
  copyright?: Copyright,
  link?: Link,
  time?: string,
  keywords?: string,
  bounds?: Bounds,
}

declare interface Options{
  creator ?: string,
  version ?: string,
  metadata ?: MetaData,
}
 
declare interface KeyValue {
  key : string,
  value : string,
}