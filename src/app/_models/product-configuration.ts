import { ConfigurationType } from "./constants"

export interface ProductConfiguration {
  id: string
  productId: string
  productName: string
  configurationData: string
  fileName: string
  configurationType: ConfigurationType
}
