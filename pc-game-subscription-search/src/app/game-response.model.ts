export interface Query {
  data: Property[]
}

export interface GameResponse {
  query: Query
}

export interface Property {
  property: string,
  dataitem: DataItem[]
}

export interface DataItem {
  type: string,
  item: string
}