import { CheckOrders } from "./check-order"

export interface OrderFile {
  id: string
  batchId: string
  fileName: string
  filePath: string
  status: string
  personalQuantity:number
  commercialQuantity:number
  errorMessage:string
  checkOrders:CheckOrders[]
}
