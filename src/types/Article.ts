export interface Article {
  id: string
  designation: string
  category: string
  status: string
  articleCode?: string
  articleName?: string
  image?: string
  startDate?: string
  endDate?: string
  designation2?: string
  designation3?: string
  segPhrasesAppel?: string
  segHMStanding?: string
  segDAS?: string
  searchKey?: string
  productLine?: string
  eanCode?: string
  customsRef?: string
  regionState?: string
  division?: string
  family?: string
  subFamily?: string
  purchaseType?: string
}

export interface TabData {
  id: string
  label: string
  active: boolean
}

export interface ModuleConfig {
  id: string
  title: string
  breadcrumbPath: string[]
  tabs: TabConfig[]
  contextButtons: ContextButton[]
  entityName: string
  entityNamePlural: string
}

export interface TabConfig {
  id: string
  label: string
  active: boolean
  component?: string
}

export interface ContextButton {
  id: string
  label: string
  color: string
  icon: string
  action?: string
}